'use client';

import { useEffect, useRef, useState } from 'react';
import { storeApi } from '@/lib/api';
import { cart, useCart, type CartLine, type QuoteLine } from './cart-store';

/**
 * Re-prices the bag against the live catalogue whenever its contents change,
 * applies the result (prices, limits, sold-out items) and returns any notices.
 */
export function useQuote() {
  const { items, ready } = useCart();
  const [issues, setIssues] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const lastKey = useRef('');

  const key = items.map((item) => `${item.variantId}:${item.quantity}`).join(',');

  useEffect(() => {
    if (!ready || key === '' || key === lastKey.current) return;
    lastKey.current = key;
    const snapshot: CartLine[] = items;
    let cancelled = false;
    setChecking(true);
    storeApi<{ lines: QuoteLine[] }>('/store/cart/quote', { method: 'POST', json: { items: snapshot.map(({ variantId, quantity }) => ({ variantId, quantity })) } })
      .then(({ lines }) => {
        if (cancelled) return;
        const notices = lines.flatMap((line) => {
          const item = snapshot.find((i) => i.variantId === line.variantId);
          if (!line.issue || !item) return [];
          const label = `${line.productName ?? item.name} ${line.sizeMl ?? item.sizeMl} ml`;
          const priceChanged = line.available && line.pricePaise !== item.unitPrice ? ' Price updated.' : '';
          return [`${label}: ${line.issue}${priceChanged}`];
        });
        const priceNotices = lines.flatMap((line) => {
          const item = snapshot.find((i) => i.variantId === line.variantId);
          return item && line.available && !line.issue && line.pricePaise !== item.unitPrice ? [`${line.productName} ${line.sizeMl} ml: price updated.`] : [];
        });
        setIssues([...notices, ...priceNotices]);
        cart.applyQuote(lines);
        // Remember the bag as adjusted by this quote so it isn't immediately re-quoted
        // (which would also clear the notices we just showed).
        lastKey.current = snapshot
          .flatMap((item) => {
            const live = lines.find((line) => line.variantId === item.variantId);
            return live && live.available && live.maxQuantity > 0 ? [`${item.variantId}:${Math.min(item.quantity, live.maxQuantity)}`] : [];
          })
          .join(',');
      })
      .catch(() => !cancelled && setIssues(['We couldn’t confirm the latest prices. They will be checked again at checkout.']))
      .finally(() => !cancelled && setChecking(false));
    return () => {
      cancelled = true;
    };
  }, [key, ready, items]);

  return { issues, checking };
}
