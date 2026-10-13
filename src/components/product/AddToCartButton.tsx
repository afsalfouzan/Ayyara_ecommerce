'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';

/**
 * "Add to cart" for one size, with a short confirmation and a link to the bag.
 * `tone="champagne"` is the rounded gold button used on the home page.
 */
export function AddToCartButton({ listing, tone = 'outline', compact = false, className }: { listing: Listing; tone?: 'outline' | 'champagne'; compact?: boolean; className?: string }) {
  const champagne = tone === 'champagne';
  // The compact champagne button fits the short home page cards.
  const size = compact ? 'px-2 py-2.5 text-[10px] tracking-[0.1em]' : 'px-6 py-3.5 text-[11px] tracking-[0.2em]';
  const { product, variant } = listing;
  const { items, ready } = useCart();
  const [added, setAdded] = useState(false);
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const atLimit = ready && inBag >= variant.purchasableQuantity;

  if (soldOut) {
    return (
      <button type="button" disabled className={clsx('flex w-full cursor-not-allowed items-center justify-center border border-white/10 bg-white/5 px-4 text-xs font-medium text-stone-500', champagne ? (compact ? 'rounded-xl py-2.5' : 'rounded-xl py-3.5') : 'rounded-sm py-3')}>
        <span className="tracking-widest uppercase">SOLD OUT</span>
      </button>
    );
  }

  if (added || atLimit) {
    return (
      <Link href="/cart" className={clsx('touch-ripple flex w-full items-center justify-center space-x-2 border px-4 text-xs font-medium transition-all', champagne ? clsx('rounded-xl border-champagne/50 bg-champagne/10 text-champagne hover:bg-champagne/20', compact ? 'py-2.5 text-[10px]' : 'py-3.5') : 'rounded-sm border-[#c5a059] bg-[#c5a059]/15 py-3 text-[#e6c98f] hover:bg-[#c5a059]/25')}>
        <Icon name="check" strokeWidth={2} className="h-4 w-4" />
        <span className={clsx('uppercase', compact ? 'tracking-wide whitespace-nowrap' : 'tracking-widest')}>{atLimit && !added ? (compact ? 'IN CART' : 'IN YOUR CART') : compact ? 'ADDED · VIEW' : 'ADDED · VIEW CART'}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
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
      className={
        champagne
          ? clsx('btn-champagne flex w-full items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap uppercase', size, className)
          : 'touch-ripple flex w-full items-center justify-center space-x-2 rounded-sm border border-white/20 bg-transparent px-4 py-3 text-xs font-medium tracking-widest text-white uppercase transition-all duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-black'
      }
    >
      <Icon name={champagne ? 'bag' : 'cart'} strokeWidth={2} className="relative z-10 h-4 w-4" />
      <span className={clsx('relative z-10 uppercase', !(champagne && compact) && 'tracking-widest')}>{champagne ? 'ADD TO BAG' : 'ADD TO CART'}</span>
      <span className="sr-only">
        : {product.name} {variant.sizeMl} ml
      </span>
    </button>
  );
}
