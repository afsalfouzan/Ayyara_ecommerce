'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { buttonClasses } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';

/** "Add to bag" for one size, with a short confirmation and a link to the bag. */
export function AddToCartButton({ listing, className }: { listing: Listing; className?: string }) {
  const { product, variant } = listing;
  const { items, ready } = useCart();
  const [added, setAdded] = useState(false);
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const atLimit = ready && inBag >= variant.purchasableQuantity;
  const shape = `w-full px-2 ${className ?? ''}`;

  if (soldOut) {
    return (
      <button type="button" disabled className={buttonClasses({ variant: 'outline', size: 'sm', className: `${shape} border-line text-mute` })}>
        Sold out
      </button>
    );
  }

  if (added || atLimit) {
    return (
      <Link href="/cart" className={buttonClasses({ variant: 'primary', size: 'sm', className: shape })}>
        <Icon name="check" strokeWidth={2} className="h-4 w-4" />
        {atLimit && !added ? 'In bag' : 'Added · View bag'}
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
      className={buttonClasses({ variant: 'outline', size: 'sm', className: shape })}
    >
      Add to bag
      <span className="sr-only">
        : {product.name} {variant.sizeMl} ml
      </span>
    </button>
  );
}
