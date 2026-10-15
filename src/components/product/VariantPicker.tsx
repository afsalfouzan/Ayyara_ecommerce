'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import { discountPercent, formatPrice, stockLabel } from '@/lib/format';
import { site } from '@/lib/site';
import type { Product } from '@/lib/types';

/**
 * Everything needed to buy a perfume from its page: the price, the sizes in
 * stock, the quantity, Add to bag and Buy now. On a phone a slim bar with the
 * price and Add to bag also stays fixed to the bottom of the screen (in place
 * of the bar of shortcuts).
 */
export function VariantPicker({ product }: { product: Pick<Product, 'id' | 'slug' | 'name' | 'images' | 'variants'> }) {
  const router = useRouter();
  const { items } = useCart();
  const firstAvailable = product.variants.find((v) => v.stockStatus !== 'out_of_stock') ?? product.variants[0]!;
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const remaining = Math.max(0, variant.purchasableQuantity - inBag);
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const shownQuantity = Math.min(quantity, Math.max(1, remaining));
  const percentOff = discountPercent(variant.mrpPaise, variant.pricePaise);
  const blocked = soldOut || remaining === 0;
  const addLabel = soldOut ? 'Sold out' : remaining === 0 ? 'Maximum in bag' : 'Add to bag';
  // Once this size is in the bag, the quantity box shows the bag's count and − / + change the bag itself, up to the stock.
  const shownCount = inBag > 0 ? inBag : shownQuantity;
  const canDecrease = inBag > 0 ? inBag > 1 : !blocked && shownQuantity > 1;
  const canIncrease = inBag > 0 ? inBag < variant.purchasableQuantity : !blocked && shownQuantity < remaining;
  const decrease = () => (inBag > 0 ? cart.setQuantity(variant.id, inBag - 1) : setQuantity(shownQuantity - 1));
  // Adding through cart.add refreshes the line's stock limit, which a bag saved earlier may still hold at an old value.
  const increase = () => (inBag > 0 ? cart.add(line(), 1) : setQuantity(shownQuantity + 1));
  const inBagNotFull = inBag > 0 && remaining > 0;

  /** The bag line for this size, with today's price and stock limit. */
  const line = () => ({ variantId: variant.id, productId: product.id, slug: product.slug, name: product.name, sizeMl: variant.sizeMl, unitPrice: variant.pricePaise, mrp: variant.mrpPaise, maxQuantity: variant.purchasableQuantity, image: product.images[0] ?? null });

  function add(count = shownQuantity) {
    if (remaining === 0) return;
    cart.add(line(), Math.min(count, remaining));
    setQuantity(1);
  }

  /** Puts the chosen bottles in the bag (unless this size is already there) and opens checkout. */
  function buyNow() {
    if (inBag === 0) add();
    router.push('/checkout');
  }

  const stepper = 'flex h-11 w-10 items-center justify-center text-lg text-fg transition-colors hover:bg-surface disabled:opacity-35';

  return (
    <div data-purchase-bar className="flex flex-col gap-6">
      <div>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {percentOff > 0 && <span className="sr-only">Now </span>}
          <span className="text-2xl font-medium text-fg">{formatPrice(variant.pricePaise)}</span>
          {percentOff > 0 && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-base text-mute line-through">{formatPrice(variant.mrpPaise)}</span>
              <span className="text-sm font-medium text-sale">{percentOff}% off</span>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-mute">Inclusive of all taxes. Free delivery within {site.policies.deliveryArea}.</p>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-[13px] font-medium text-fg">
          Size: <span className="font-normal text-mute">{variant.sizeMl} ml</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((option) => {
            const out = option.stockStatus === 'out_of_stock' || option.purchasableQuantity === 0;
            const selected = option.id === variant.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setVariantId(option.id);
                  setQuantity(1);
                }}
                className={clsx('min-w-20 rounded-[2px] border px-4 py-2.5 text-left text-sm transition-colors', selected ? 'border-fg bg-fg text-white' : 'border-line bg-canvas text-fg hover:border-fg', out && !selected && 'text-mute line-through')}
              >
                <span className="block font-medium">{option.sizeMl} ml</span>
                <span className={clsx('block text-xs', selected ? 'text-white/80' : 'text-mute')}>{out ? 'Sold out' : formatPrice(option.pricePaise)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <div className="flex items-stretch gap-3">
          <div role="group" aria-label="Quantity" className="flex items-center rounded-[2px] border border-line">
            <button type="button" aria-label="Decrease quantity" disabled={!canDecrease} onClick={decrease} className={stepper}>
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-fg tabular-nums" aria-live="polite">
              {shownCount}
            </span>
            <button type="button" aria-label="Increase quantity" disabled={!canIncrease} onClick={increase} className={stepper}>
              +
            </button>
          </div>
          {inBagNotFull ? (
            <Button onClick={() => router.push('/cart')} className="h-auto min-h-11 flex-1">
              View bag
            </Button>
          ) : (
            <Button onClick={() => add()} disabled={blocked} className="h-auto min-h-11 flex-1">
              {addLabel}
            </Button>
          )}
        </div>
        {!soldOut && (
          <Button variant="outline" onClick={buyNow} className="w-full">
            Buy now
          </Button>
        )}
        <p role="status" aria-live="polite" className="min-h-5 text-sm">
          {soldOut ? (
            <span className="text-mute">This size is currently unavailable. {product.variants.length > 1 ? 'Try another size or check back soon.' : 'Please check back soon.'}</span>
          ) : remaining === 0 ? (
            // The bag already holds every bottle of this size the godown has.
            <span className="text-fg">
              Your bag has all {variant.purchasableQuantity} available.{' '}
              <Link href="/cart" className="underline underline-offset-4">
                View bag
              </Link>
            </span>
          ) : inBag > 0 ? (
            <span className="inline-flex animate-fade-up items-center gap-2 text-success">
              <Icon name="check" strokeWidth={2} className="h-4 w-4" />
              {inBag} in your bag.
              <Link href="/cart" className="text-fg underline underline-offset-4">
                View bag
              </Link>
            </span>
          ) : (
            variant.stockStatus === 'low_stock' && <span className="font-medium text-fg">{stockLabel.low_stock}</span>
          )}
        </p>
      </div>

      {/* Phones: the price and Add to bag stay in reach at the bottom of the screen. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-canvas/95 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs text-mute">
            {product.name} · {variant.sizeMl} ml
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-base font-medium text-fg">{formatPrice(variant.pricePaise)}</span>
            {percentOff > 0 && <span className="text-xs text-mute line-through">{formatPrice(variant.mrpPaise)}</span>}
          </span>
        </div>
        {inBagNotFull ? (
          <Button onClick={() => router.push('/cart')} className="shrink-0">
            View bag
          </Button>
        ) : (
          <Button onClick={() => add(1)} disabled={blocked} className="shrink-0">
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
