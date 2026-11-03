'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  // On phones the bar fixed to the bottom of the screen steps aside while the main buttons are on screen.
  const buttons = useRef<HTMLDivElement>(null);
  const [buttonsInView, setButtonsInView] = useState(false);
  useEffect(() => {
    const element = buttons.current;
    if (!element) return;
    const watcher = new IntersectionObserver(([entry]) => setButtonsInView(Boolean(entry?.isIntersecting)));
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

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

  const stepper = 'flex h-full w-11 items-center justify-center text-lg font-light text-fg transition-colors duration-300 hover:bg-surface disabled:opacity-35';
  /** Each group of the buy box rises in one after another when the page opens (see .pdp-rise). */
  const rise = (delay: number) => ({ '--rise-delay': `${delay}ms` }) as React.CSSProperties;

  return (
    <div data-purchase-bar className="flex flex-col gap-8">
      <div className="pdp-rise" style={rise(120)}>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {percentOff > 0 && <span className="sr-only">Now </span>}
          <span className="text-2xl font-medium text-fg">{formatPrice(variant.pricePaise)}</span>
          {percentOff > 0 && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-base font-light text-fg/40 line-through decoration-fg/30">{formatPrice(variant.mrpPaise)}</span>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-xs font-medium tracking-[0.06em] text-[color-mix(in_srgb,var(--color-gold)_62%,#000)]">{percentOff}% off</span>
            </>
          )}
        </p>
        <p className="mt-2.5 text-xs text-mute">Inclusive of all taxes. Free delivery within {site.policies.deliveryArea}.</p>
      </div>

      <fieldset className="pdp-rise" style={rise(200)}>
        <legend className="mb-3 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">
          Size
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
                className={clsx('inline-flex items-baseline gap-2 rounded-full border px-4 py-1.5 text-[13px] transition-colors duration-300', selected ? 'border-fg bg-surface text-fg' : 'border-line bg-transparent text-fg hover:border-fg/60', out && !selected && 'text-mute line-through')}
              >
                <span className="font-medium">{option.sizeMl} ml</span>
                {/* A size that can't be bought says so; the price is shown once, above. */}
                {out && <span className="text-xs text-mute">Sold out</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="pdp-rise" style={rise(260)}>
        <p className="mb-3 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">Quantity</p>
        <div role="group" aria-label="Quantity" className="flex h-12 w-fit items-center rounded-[2px] border border-line bg-transparent">
          <button type="button" aria-label="Decrease quantity" disabled={!canDecrease} onClick={decrease} className={stepper}>
            −
          </button>
          <span className="w-12 text-center text-sm font-medium text-fg tabular-nums" aria-live="polite">
            {shownCount}
          </span>
          <button type="button" aria-label="Increase quantity" disabled={!canIncrease} onClick={increase} className={stepper}>
            +
          </button>
        </div>
      </div>

      <div ref={buttons} className="pdp-rise flex flex-col gap-3" style={rise(320)}>
        {inBagNotFull ? (
          <Button variant="outline" size="lg" onClick={() => router.push('/cart')} className="w-full duration-500!">
            View bag
          </Button>
        ) : (
          <Button variant="outline" size="lg" onClick={() => add()} disabled={blocked} className="w-full duration-500!">
            {addLabel}
          </Button>
        )}
        {!soldOut && (
          <Button size="lg" onClick={buyNow} className="w-full duration-500!">
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
      <div inert={buttonsInView} aria-hidden={buttonsInView} className={clsx('fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-canvas/95 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md transition-transform duration-300 ease-out md:hidden', buttonsInView && 'translate-y-full')}>
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
