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
export function AddToCartButton({ listing, tone = 'outline' }: { listing: Listing; tone?: 'outline' | 'champagne' }) {
  const champagne = tone === 'champagne';
  const { product, variant } = listing;
  const { items, ready } = useCart();
  const [added, setAdded] = useState(false);
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const atLimit = ready && inBag >= variant.purchasableQuantity;

  if (soldOut) {
    return (
      <button type="button" disabled className={clsx('flex w-full cursor-not-allowed items-center justify-center border border-white/10 bg-white/5 px-4 text-xs font-medium text-stone-500', champagne ? 'rounded-xl py-3.5' : 'rounded-sm py-3')}>
        <span className="tracking-widest uppercase">SOLD OUT</span>
      </button>
    );
  }

  if (added || atLimit) {
    return (
      <Link href="/cart" className={clsx('touch-ripple flex w-full items-center justify-center space-x-2 border px-4 text-xs font-medium transition-all', champagne ? 'rounded-xl border-champagne/50 bg-champagne/10 py-3.5 text-champagne hover:bg-champagne/20' : 'rounded-sm border-[#c5a059] bg-[#c5a059]/15 py-3 text-[#e6c98f] hover:bg-[#c5a059]/25')}>
        <Icon name="check" strokeWidth={2} className="h-4 w-4" />
        <span className="tracking-widest uppercase">{atLimit && !added ? 'IN YOUR CART' : 'ADDED · VIEW CART'}</span>
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
          ? 'btn-champagne flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase'
          : 'touch-ripple flex w-full items-center justify-center space-x-2 rounded-sm border border-white/20 bg-transparent px-4 py-3 text-xs font-medium tracking-widest text-white uppercase transition-all duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-black'
      }
    >
      <Icon name={champagne ? 'bag' : 'cart'} strokeWidth={2} className="relative z-10 h-4 w-4" />
      <span className="relative z-10 tracking-widest uppercase">{champagne ? 'ADD TO BAG' : 'ADD TO CART'}</span>
      <span className="sr-only">
        : {product.name} {variant.sizeMl} ml
      </span>
    </button>
  );
}
