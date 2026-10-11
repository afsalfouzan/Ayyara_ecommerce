'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';

/** "Add to cart" for one size, with a short confirmation and a link to the bag. */
export function AddToCartButton({ listing }: { listing: Listing }) {
  const { product, variant } = listing;
  const { items, ready } = useCart();
  const [added, setAdded] = useState(false);
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const atLimit = ready && inBag >= variant.purchasableQuantity;

  if (soldOut) {
    return (
      <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-stone-200 px-4 py-3 text-xs font-semibold text-stone-500">
        <span className="tracking-widest uppercase">SOLD OUT</span>
      </button>
    );
  }

  if (added || atLimit) {
    return (
      <Link href="/cart" className="touch-ripple flex w-full items-center justify-center space-x-2 rounded-lg bg-stone-800 px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-stone-700">
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
      className="touch-ripple flex w-full items-center justify-center space-x-2 rounded-lg bg-black px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-stone-800"
    >
      <Icon name="cart" strokeWidth={2} className="h-4 w-4" />
      <span className="tracking-widest uppercase">ADD TO CART</span>
      <span className="sr-only">
        : {product.name} {variant.sizeMl} ml
      </span>
    </button>
  );
}
