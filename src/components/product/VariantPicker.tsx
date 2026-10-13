'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { Icon } from '@/components/ui/icons';
import { discountPercent, formatPrice, stockLabel } from '@/lib/format';
import type { Product } from '@/lib/types';

/**
 * Everything needed to buy a perfume from its page: the price, the sizes that
 * exist in stock, the quantity, Add to bag, and a button that goes straight to
 * checkout. On a phone a slim bar with the price and Add to bag also stays
 * fixed to the bottom of the screen (in place of the bar of shortcuts).
 */
export function VariantPicker({ product }: { product: Pick<Product, 'id' | 'slug' | 'name' | 'images' | 'variants' | 'concentration'> }) {
  const router = useRouter();
  const { items } = useCart();
  const firstAvailable = product.variants.find((v) => v.stockStatus !== 'out_of_stock') ?? product.variants[0]!;
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const remaining = Math.max(0, variant.purchasableQuantity - inBag);
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;
  const shownQuantity = Math.min(quantity, Math.max(1, remaining));
  const percentOff = discountPercent(variant.mrpPaise, variant.pricePaise);

  function add(count = shownQuantity) {
    if (remaining === 0) return;
    cart.add(
      {
        variantId: variant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sizeMl: variant.sizeMl,
        unitPrice: variant.pricePaise,
        mrp: variant.mrpPaise,
        maxQuantity: variant.purchasableQuantity,
        image: product.images[0] ?? null,
      },
      Math.min(count, remaining),
    );
    setQuantity(1);
    setAdded(true);
  }

  /** Puts the chosen bottles in the bag (unless it already holds as many as allowed) and opens checkout. */
  function buyNow() {
    add();
    router.push('/checkout');
  }

  const addLabel = soldOut ? 'Sold out' : remaining === 0 ? 'Maximum in bag' : 'Add to bag';

  return (
    <div data-purchase-bar className="flex flex-col gap-4">
      {/* Price */}
      <div>
        <div className="flex items-baseline justify-between gap-3 rounded-xl bg-[#201f1f] p-3.5 shadow-sm">
          <div className="flex flex-wrap items-baseline gap-x-2.5">
            {percentOff > 0 && <span className="sr-only">Now </span>}
            <span className="font-playfair text-[22px] leading-[30px] font-semibold text-[#cec5b9]">{formatPrice(variant.pricePaise)}</span>
            {percentOff > 0 && (
              <>
                <span className="sr-only">MRP </span>
                <span className="text-[13px] text-[#c4c7c4] line-through">{formatPrice(variant.mrpPaise)}</span>
              </>
            )}
          </div>
          {percentOff > 0 && <span className="shrink-0 rounded-xl bg-[#cec5b9]/15 px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#cec5b9] uppercase">Save {percentOff}%</span>}
        </div>
        <p className="mt-2 flex items-start gap-1.5 px-1 text-xs text-[#c4c7c4]">
          <Icon name="truck" strokeWidth={1.8} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#cec5b9]" />
          <span>Complimentary courier across India • All taxes included</span>
        </p>
      </div>

      {/* Sizes */}
      <fieldset className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <legend className="float-left text-[11px] font-semibold tracking-widest text-[#c4c7c4] uppercase">Select Presentation</legend>
          <span className="text-[13px] font-medium text-[#cec5b9]">{variant.sizeMl}ml Flacon</span>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
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
                  setAdded(false);
                }}
                className={clsx('relative flex w-full items-center justify-between gap-3 rounded-xl p-3.5 text-left transition-all', selected ? 'bg-[#2a2a2a] shadow-md ring-1 ring-[#cec5b9]' : 'bg-[#1c1b1b] hover:bg-[#201f1f]', out && !selected && 'opacity-60')}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#353534] text-[#cec5b9]">
                    <Icon name="flask" strokeWidth={1.8} className="h-5 w-5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[15px] leading-6 font-medium text-white">{option.sizeMl}ml Flacon</span>
                    <span className="truncate text-[13px] leading-5 text-[#c4c7c4]">{out ? 'Sold out' : option.stockStatus === 'low_stock' ? stockLabel.low_stock : product.concentration}</span>
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end text-right">
                  <span className="text-xs font-semibold tracking-wide text-white">{formatPrice(option.pricePaise)}</span>
                  {option.mrpPaise > option.pricePaise && <span className="text-[11px] text-[#c4c7c4] line-through">{formatPrice(option.mrpPaise)}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* The promise that comes with every bottle */}
      <div className="flex items-start gap-3 rounded-xl bg-[#1c1b1b] p-3.5 shadow-inner">
        <span className="mt-0.5 shrink-0 rounded-full bg-[#cec5b9]/10 p-2 text-[#cec5b9]">
          <Icon name="lockOpen" strokeWidth={1.8} className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold tracking-wide text-white">The 100% Risk-Free Olfactory Promise</span>
          <p className="text-[13px] leading-relaxed text-[#c4c7c4]">Test first. Every flacon arrives with a complimentary sealed 2ml miniature. Spritz the sample on skin; if it does not enchant you, return the unsealed full bottle for a prompt 100% refund.</p>
        </div>
      </div>

      {/* Quantity, Add to bag, straight to checkout */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div role="group" aria-label="Quantity" className="flex items-center rounded-lg bg-[#2a2a2a] p-1">
            <button type="button" aria-label="Decrease quantity" disabled={soldOut || shownQuantity <= 1} onClick={() => setQuantity(shownQuantity - 1)} className="flex h-10 w-10 items-center justify-center text-lg text-[#e5e2e1] transition-transform hover:text-[#cec5b9] active:scale-95 disabled:opacity-40">
              −
            </button>
            <span className="w-8 text-center text-xs font-semibold text-white tabular-nums" aria-live="polite">
              {shownQuantity}
            </span>
            <button type="button" aria-label="Increase quantity" disabled={soldOut || shownQuantity >= remaining} onClick={() => setQuantity(shownQuantity + 1)} className="flex h-10 w-10 items-center justify-center text-lg text-[#e5e2e1] transition-transform hover:text-[#cec5b9] active:scale-95 disabled:opacity-40">
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => add()}
            disabled={soldOut || remaining === 0}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#cec5b9] text-[11px] font-bold tracking-widest text-[#0e0e0e] uppercase shadow-lg transition-transform active:scale-[0.98] disabled:bg-[#353534] disabled:text-[#8e918f]"
          >
            <Icon name="bag" strokeWidth={2} className="h-[18px] w-[18px]" />
            <span>{soldOut || remaining === 0 ? addLabel : `Add to bag • ${formatPrice(variant.pricePaise * shownQuantity)}`}</span>
          </button>
        </div>
        {!soldOut && (
          <button type="button" onClick={buyNow} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#353534] text-[11px] font-semibold tracking-widest text-white uppercase transition-all hover:bg-[#3a3939] active:scale-[0.99]">
            <Icon name="bolt" strokeWidth={2} className="h-4 w-4 text-[#cec5b9]" />
            <span>Instant Express Checkout</span>
          </button>
        )}
        <p role="status" aria-live="polite" className="min-h-5 text-sm">
          {soldOut ? (
            <span className="text-[#c4c7c4]">This size is currently unavailable. {product.variants.length > 1 ? 'Try another size or check back soon.' : 'Please check back soon.'}</span>
          ) : (
            added && (
              <span className="inline-flex animate-fade-up items-center gap-2 text-[#cec5b9]">
                <Icon name="check" strokeWidth={2} className="h-4 w-4" />
                Added to your bag.
                <Link href="/cart" className="text-white underline underline-offset-4 hover:text-[#cec5b9]">
                  View bag
                </Link>
              </span>
            )
          )}
        </p>
      </div>

      {/* Phones: the price and Add to bag stay in reach at the bottom of the screen. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/5 bg-[#0e0e0e]/95 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl md:hidden">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[10px] font-semibold tracking-widest text-[#c4c7c4] uppercase">
            {product.name} {variant.sizeMl}ml
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-playfair text-lg font-semibold text-[#cec5b9]">{formatPrice(variant.pricePaise)}</span>
            {percentOff > 0 && <span className="text-[11px] text-[#c4c7c4] line-through">{formatPrice(variant.mrpPaise)}</span>}
          </span>
        </div>
        <button
          type="button"
          onClick={() => add(1)}
          disabled={soldOut || remaining === 0}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#cec5b9] px-5 text-[11px] font-bold tracking-widest text-[#0e0e0e] uppercase shadow-lg transition-transform active:scale-[0.98] disabled:bg-[#353534] disabled:text-[#8e918f]"
        >
          <Icon name="bag" strokeWidth={2} className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}
