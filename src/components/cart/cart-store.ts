'use client';

import { useSyncExternalStore } from 'react';
import type { Paise, ProductImage } from '@/lib/types';

/**
 * Client-side bag. Prices stored here are a display snapshot only — the backend
 * re-prices every line and re-checks stock when the order is created.
 */
export type CartLine = {
  variantId: number;
  productId: number;
  slug: string;
  name: string;
  sizeMl: number;
  unitPrice: Paise;
  mrp: Paise;
  quantity: number;
  maxQuantity: number;
  image: ProductImage | null;
};

// v2: lines are per size (variant). Older v1 bags are ignored.
const STORAGE_KEY = 'ayyara.cart.v2';
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / storage disabled: the bag still works for this tab.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    lines = read();
  }
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      lines = read();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const clamp = (value: number, max: number) => Math.max(1, Math.min(value, Math.max(1, max)));

export const cart = {
  add(line: Omit<CartLine, 'quantity'>, quantity = 1) {
    const existing = lines.find((item) => item.variantId === line.variantId);
    if (existing) {
      write(
        lines.map((item) =>
          item.variantId === line.variantId
            ? { ...item, ...line, quantity: clamp(item.quantity + quantity, line.maxQuantity) }
            : item,
        ),
      );
    } else {
      write([...lines, { ...line, quantity: clamp(quantity, line.maxQuantity) }]);
    }
  },
  setQuantity(variantId: number, quantity: number) {
    write(lines.map((item) => (item.variantId === variantId ? { ...item, quantity: clamp(quantity, item.maxQuantity) } : item)));
  },
  remove(variantId: number) {
    write(lines.filter((item) => item.variantId !== variantId));
  },
  /** Applies a server quote: live prices and limits, removing lines that can't be bought. */
  applyQuote(quote: QuoteLine[]) {
    const next = lines.flatMap((item) => {
      const live = quote.find((line) => line.variantId === item.variantId);
      if (!live || !live.available || live.maxQuantity === 0) return [];
      return [{ ...item, name: live.productName, slug: live.slug, sizeMl: live.sizeMl, unitPrice: live.pricePaise, mrp: live.mrpPaise, maxQuantity: live.maxQuantity, quantity: Math.min(item.quantity, live.maxQuantity), image: live.image ?? item.image }];
    });
    if (JSON.stringify(next) !== JSON.stringify(lines)) write(next);
  },
  clear() {
    write(EMPTY);
  },
};

export type QuoteLine = {
  variantId: number;
  available: boolean;
  productName: string;
  slug: string;
  sizeMl: number;
  image: ProductImage | null;
  mrpPaise: Paise;
  pricePaise: Paise;
  quantity: number;
  maxQuantity: number;
  issue: string | null;
};

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY,
  );
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { items, count, subtotal, ready };
}
