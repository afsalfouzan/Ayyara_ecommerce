'use client';

import { Info } from 'lucide-react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatPrice } from '@/lib/format';
import { cart, useCart } from './cart-store';
import { LineThumb } from './LineThumb';
import { useQuote } from './useQuote';

export function CartView() {
  const { items, subtotal, ready } = useCart();
  const { issues, checking } = useQuote();
  const savings = items.reduce((total, item) => total + Math.max(0, item.mrp - item.unitPrice) * item.quantity, 0);

  if (!ready) {
    return <div className="mt-12 h-64 animate-pulse bg-surface" aria-busy="true" aria-label="Loading bag" />;
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 space-y-6">
        {issues.length > 0 && <Notices issues={issues} />}
        <div className="border-y border-line py-24 text-center">
          <p className="font-display text-3xl">Your bag is empty.</p>
          <p className="mt-3 text-mute">Discover a fragrance to begin.</p>
          <ButtonLink href="/shop" className="mt-10">
            Shop the collection
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-8">
      {issues.length > 0 && <Notices issues={issues} />}
      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.variantId} className="grid grid-cols-[5.5rem_1fr] gap-5 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
              <Link href={`/products/${item.slug}`} tabIndex={-1} aria-hidden>
                <LineThumb line={item} sizes="112px" />
              </Link>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-2xl leading-tight">
                      <Link href={`/products/${item.slug}`} className="hover:text-gold-bright">
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-mute">{item.sizeMl} ml</p>
                  </div>
                  <Price price={item.unitPrice * item.quantity} mrp={item.mrp * item.quantity} showSaving={false} className="shrink-0 justify-end pt-1 text-right" />
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                  <QuantityStepper size="sm" label={`Quantity of ${item.name} ${item.sizeMl} ml`} value={item.quantity} max={item.maxQuantity} onChange={(value) => cart.setQuantity(item.variantId, value)} />
                  <button type="button" onClick={() => cart.remove(item.variantId)} className="label link-underline text-mute hover:text-fg">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside aria-labelledby="summary-heading" className="h-fit bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 id="summary-heading" className="text-2xl">
            Order summary
          </h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-mute">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-gold-bright">
                <dt>You save</dt>
                <dd className="tabular-nums">{formatPrice(savings)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-mute">Delivery</dt>
              <dd>Free</dd>
            </div>
          </dl>
          <div className="mt-6 flex justify-between border-t border-line pt-6 text-base">
            <span>Total</span>
            <span className="tabular-nums" aria-busy={checking}>
              {formatPrice(subtotal)}
            </span>
          </div>
          <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
            Proceed to checkout
          </ButtonLink>
          <p className="mt-4 text-center text-xs text-mute">Prices and availability are confirmed when you place the order.</p>
        </aside>
      </div>
    </div>
  );
}

function Notices({ issues }: { issues: string[] }) {
  return (
    <div role="status" className="flex gap-3 border border-gold/50 bg-gold-soft/40 p-4 text-sm text-fg-soft">
      <Info className="mt-0.5 size-4 shrink-0 text-gold-bright" strokeWidth={1.5} aria-hidden />
      <ul className="space-y-1">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
