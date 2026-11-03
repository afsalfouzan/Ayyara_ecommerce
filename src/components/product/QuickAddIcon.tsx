'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';

const round =
  'flex h-10 w-10 items-center justify-center rounded-full border border-fg/10 bg-surface/90 text-fg shadow-[0_6px_18px_-8px_rgb(0_0_0/0.35)] backdrop-blur-sm transition-[background-color,color,transform] duration-500 ease-out sm:h-11 sm:w-11 hover:scale-105 hover:bg-fg hover:text-white focus-visible:bg-fg focus-visible:text-white';

/**
 * "Add to bag" as a small round bag icon that sits on the photo's corner (on every screen). It adds one bottle; once added,
 * or when the bag already holds every bottle in stock, it becomes a check that opens the bag.
 */
export function QuickAddIcon({ listing }: { listing: Listing }) {
  const { product, variant } = listing;
  const { items, ready } = useCart();
  const [added, setAdded] = useState(false);
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const atLimit = ready && inBag >= variant.purchasableQuantity;
  const label = `${product.name} ${variant.sizeMl} ml`;

  if (soldOut) return null;

  if (added || atLimit) {
    return (
      <Link href="/cart" aria-label={`In your bag: ${label}. View bag`} className={`${round} bg-fg text-white`}>
        <Icon name="check" strokeWidth={1.6} className="h-[18px] w-[18px]" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Add to bag: ${label}`}
      onClick={() => {
        cart.add({
          variantId: variant.id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          sizeMl: variant.sizeMl,
          unitPrice: variant.pricePaise,
          mrp: variant.mrpPaise,
          maxQuantity: variant.purchasableQuantity,
          image: product.images[0] ?? null,
        });
        setAdded(true);
      }}
      className={round}
    >
      <Icon name="bag" strokeWidth={1.4} className="h-[18px] w-[18px]" />
    </button>
  );
}
