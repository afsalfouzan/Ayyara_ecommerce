'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductArt } from '@/components/product/ProductArt';
import { ShopProductCard } from '@/components/product/ShopProductCard';
import { Icon, type IconName } from '@/components/ui/icons';
import { artFor, formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import type { Product } from '@/lib/types';
import { cart, useCart, type CartLine } from './cart-store';
import { useQuote } from './useQuote';

const card = 'rounded-2xl border border-[rgb(200_182_155/0.16)] bg-[radial-gradient(circle_at_10%_10%,rgba(200,182,155,0.04),transparent_50%),rgba(19,18,17,0.9)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]';
const pill = 'rounded-full border border-[#c8b69b]/25 bg-[rgba(35,33,31,0.85)] px-2.5 py-0.5 text-[9px] font-semibold tracking-wider text-[#d8c8b2] uppercase';

const pillars: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: '100% Satisfaction Guarantee', text: 'Every flacon is accompanied by a complimentary discovery vial. Sample first; return undamaged packages hassle-free.' },
  { icon: 'flask', title: '28% Extrait de Parfum Concentration', text: 'Hand-macerated for 90 days. Exceptional sillage with 14+ hours of lasting olfactory projection.' },
  { icon: 'truck', title: 'Swift & Insured Delivery', text: 'Dispatched within 24 hours from our atelier vault in secure shock-absorbent packaging.' },
];

/**
 * The bag: its items, the order summary, perfumes that go with it, and the
 * house promises. `products` is the catalogue, used for each item's notes and
 * for the suggestions; prices and limits in the bag itself are re-checked
 * against the backend by `useQuote`.
 */
export function CartView({ products }: { products: Product[] }) {
  const { items, subtotal, count, ready } = useCart();
  const { issues, checking } = useQuote();
  const savings = items.reduce((total, item) => total + Math.max(0, item.mrp - item.unitPrice) * item.quantity, 0);
  const inBag = new Set(items.map((item) => item.productId));
  // One card per perfume not yet in the bag, in its first size that can be bought.
  const pairings = products
    .filter((product) => !inBag.has(product.id))
    .flatMap((product) => {
      const variant = product.variants.find((v) => v.stockStatus !== 'out_of_stock') ?? product.variants[0];
      return variant ? [{ product, variant }] : [];
    })
    .slice(0, 6);

  return (
    <>
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#cec5b9] uppercase">Atelier Selection</span>
          {ready && count > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium tracking-wide text-[#c4c7c4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#eae1d5]" />
              {count} Rare {count === 1 ? 'Extrait' : 'Extraits'} in Bag
            </span>
          )}
        </div>
        <h1 className="font-playfair text-[28px] leading-9 font-normal tracking-tight text-white md:text-[40px] md:leading-[48px]">Your Shopping Bag</h1>
      </header>

      {!ready ? (
        <div className={`mt-6 h-64 animate-pulse ${card}`} aria-busy="true" aria-label="Loading bag" />
      ) : items.length === 0 ? (
        <div className="mt-6 flex flex-col gap-6">
          {issues.length > 0 && <Notices issues={issues} />}
          <div className={`${card} px-6 py-16 text-center`}>
            <p className="font-playfair text-2xl text-[#fbf7f0]">Your bag is empty.</p>
            <p className="mt-2 text-[13px] text-[#c4c7c4]">Discover our signature fragrances to begin.</p>
            <Link href="/shop" className="btn-champagne mt-8 inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-[11px] font-bold tracking-[0.22em] uppercase">
              <span className="relative z-10">Shop the collection</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-4">
          {/* Delivery is free on every order. */}
          <div className="flex flex-col gap-2 rounded-lg bg-[#1c1b1b] p-3.5">
            <div className="flex items-center justify-between gap-3 text-xs font-medium tracking-wide">
              <div className="flex items-center gap-2 text-[#cec5b9]">
                <Icon name="badgeCheck" className="h-[18px] w-[18px] shrink-0" />
                <span className="text-[#e5e2e1]">Complimentary Insured Courier unlocked</span>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-[#cec5b9] uppercase">Free</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#353534]">
              <div className="h-full w-full rounded-full bg-[#cec5b9]" />
            </div>
            <p className="text-[11px] text-[#c4c7c4]">Delivered across India in {site.policies.deliveryWindow.replace(' across India', '')}.</p>
          </div>

          {issues.length > 0 && <Notices issues={issues} />}

          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_24rem] lg:gap-8">
            <section aria-label="Items in your bag" className="flex flex-col gap-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.variantId}>
                    <BagItem item={item} product={products.find((product) => product.id === item.productId)} />
                  </li>
                ))}
              </ul>

              <aside className="relative flex items-start gap-3.5 overflow-hidden rounded-2xl border border-[rgb(200_182_155/0.2)] bg-[radial-gradient(circle_at_0%_50%,rgba(200,182,155,0.08),rgba(18,17,16,0.85)_60%)] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgb(200_182_155/0.3)] bg-[linear-gradient(135deg,rgba(200,182,155,0.18),rgba(200,182,155,0.04))] text-[#ded3be] shadow-md">
                  <Icon name="gift" strokeWidth={1.8} className="h-[19px] w-[19px]" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium tracking-wide text-[#fbf7f0]">Complimentary 2ml Sealed Tester Included</p>
                    <span className="shrink-0 rounded border border-[#c8b69b]/25 bg-[rgba(35,33,31,0.85)] px-2 py-0.5 text-[8px] font-semibold tracking-wider text-[#d8c8b2] uppercase">Gift</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#c4c7c4]">Test on skin first. If the scent does not harmonize with your chemistry, return the unopened flacon for a complimentary exchange or full refund.</p>
                </div>
              </aside>
            </section>

            <section
              aria-labelledby="summary-heading"
              className="flex flex-col gap-4 rounded-2xl border border-[rgb(200_182_155/0.18)] bg-[radial-gradient(circle_at_100%_0%,rgba(200,182,155,0.04),transparent_60%),rgba(20,19,18,0.94)] p-6 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.75)] lg:sticky lg:top-28"
            >
              <div className="flex items-baseline justify-between border-b border-[#c8b69b]/15 pb-3">
                <div>
                  <span className="mb-0.5 block text-[9px] font-semibold tracking-[0.25em] text-[#baa689] uppercase">Vault Checkout</span>
                  <h2 id="summary-heading" className="font-playfair text-[22px] font-normal tracking-wide text-[#fbf7f0]">
                    Order summary
                  </h2>
                </div>
                <span className="rounded-full border border-[#c8b69b]/25 bg-[rgb(200_182_155/0.06)] px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] text-[#ded3be] uppercase">INR (₹)</span>
              </div>
              <dl className="flex flex-col gap-3 pt-1 text-[13px]">
                <div className="flex items-center justify-between">
                  {/* With a saving, the first line is the full MRP so the three lines add up to the total. */}
                  <dt className="text-[#c4c7c4]">{savings > 0 ? 'MRP total' : 'Subtotal'}</dt>
                  <dd className="font-medium tracking-wide text-[#fbf7f0] tabular-nums">{formatPrice(subtotal + savings)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-[#c8b69b]">
                      <Icon name="star" strokeWidth={1.8} className="h-[15px] w-[15px]" />
                      You save
                    </dt>
                    <dd className="font-medium tracking-wide text-[#d8c8b2] tabular-nums">- {formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-[#c4c7c4]">Insured pan-India Delivery</dt>
                  <dd className="rounded-full border border-[#c8b69b]/25 bg-[rgb(200_182_155/0.06)] px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#ded3be] uppercase">Free</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#c4c7c4]">Taxes</dt>
                  <dd className="text-xs text-[#8e918f]">Included</dd>
                </div>
              </dl>
              <div className="flex items-baseline justify-between rounded-xl border border-[#c8b69b]/20 bg-[radial-gradient(circle_at_50%_50%,rgba(200,182,155,0.05),rgba(24,23,21,0.7))] px-4 pt-3.5 pb-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                <div>
                  <span className="font-playfair text-lg font-normal tracking-wide text-[#fbf7f0]">Total</span>
                  <span className="mt-0.5 block text-[11px] text-[#c4c7c4]">All taxes inclusive</span>
                </div>
                <span className="font-playfair text-2xl font-medium tracking-tight text-[#fbf7f0] tabular-nums" aria-busy={checking}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-center text-[11px] leading-relaxed text-[#8e918f]">Prices and availability are confirmed when you place the order.</p>
              <Link href="/checkout" className="btn-champagne flex h-14 w-full items-center justify-center gap-2.5 rounded-xl text-[11px] font-bold tracking-[0.22em] uppercase">
                <Icon name="lock" strokeWidth={2} className="relative z-10 h-[19px] w-[19px]" />
                <span className="relative z-10">Proceed to Checkout</span>
              </Link>
              <ul className="grid grid-cols-3 gap-2 border-t border-[#c8b69b]/15 pt-3 text-center">
                {(
                  [
                    ['shield', 'Secure SSL'],
                    ['card', 'UPI / Cards'],
                    ['returnArrow', `${site.policies.returnWindowDays}-Day Returns`],
                  ] as [IconName, string][]
                ).map(([icon, label]) => (
                  <li key={label} className="flex flex-col items-center">
                    <Icon name={icon} strokeWidth={1.8} className="h-[18px] w-[18px] text-[#baa689]" />
                    <span className="mt-1 text-[9px] font-semibold tracking-wider text-[#c4c7c4] uppercase">{label}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* Perfumes that aren't in the bag yet */}
      {ready && pairings.length > 0 && (
        <section aria-labelledby="pairings-heading" className="mt-10 flex flex-col gap-4 md:mt-14">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#baa689] uppercase">Harmonizing Accords</span>
            <h2 id="pairings-heading" className="font-playfair text-[22px] leading-[30px] text-white md:text-[28px] md:leading-9">
              Complete Your Wardrobe
            </h2>
          </div>
          <ul className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {pairings.map((listing) => (
              <li key={listing.variant.id} className="w-[200px] shrink-0 md:w-[240px]">
                <ShopProductCard listing={listing} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What the house promises */}
      <ul className="mt-10 grid grid-cols-1 gap-4 rounded-2xl bg-[#1c1b1b] p-5 md:mt-14 md:grid-cols-3 md:gap-6 md:p-6">
        {pillars.map((pillar) => (
          <li key={pillar.title} className="flex items-start gap-3">
            <Icon name={pillar.icon} strokeWidth={1.8} className="mt-0.5 h-5 w-5 shrink-0 text-[#cec5b9]" />
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-white uppercase">{pillar.title}</p>
              <p className="mt-0.5 text-[13px] leading-5 text-[#c4c7c4]">{pillar.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function BagItem({ item, product }: { item: CartLine; product?: Product }) {
  const href = `/products/${item.slug}`;
  const saving = Math.max(0, item.mrp - item.unitPrice);
  const notes = product?.notes ? [product.notes.top[0], product.notes.base[0]].filter((note): note is string => Boolean(note)) : [];
  const label = `${item.name} ${item.sizeMl} ml`;
  return (
    <article className={`${card} relative flex flex-col gap-4 overflow-hidden p-5`}>
      <div className="flex items-center gap-4">
        <Link href={href} tabIndex={-1} aria-hidden className="relative flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#c8b69b]/20 bg-[#2a2a2a] shadow-lg">
          {item.image ? <Image src={item.image.src} alt="" fill sizes="200px" quality={85} className="object-cover object-center" /> : <ProductArt art={artFor(item.slug)} name={item.name} className="h-full w-full" />}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 text-[9px] font-semibold tracking-[0.22em] text-[#baa689] uppercase">{product?.concentration ?? 'Flacon'}</span>
            <button type="button" onClick={() => cart.remove(item.variantId)} className="flex shrink-0 items-center gap-1 p-1 text-[10px] font-semibold tracking-wider text-[#8e918f] uppercase opacity-70 transition-all hover:text-[#ffb4ab] hover:opacity-100">
              <Icon name="close" strokeWidth={2} className="h-[15px] w-[15px]" />
              <span>Remove</span>
              <span className="sr-only">{label}</span>
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="truncate font-playfair text-[22px] leading-tight font-normal tracking-wide text-[#fbf7f0]">
              <Link href={href} className="transition-colors hover:text-[#cec5b9]">
                {item.name}
              </Link>
            </h2>
            <p className="mt-0.5 text-xs tracking-wide text-[#c4c7c4]">{item.sizeMl} ml Flacon</p>
          </div>
          {notes.length > 0 && (
            <ul className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {notes.map((note) => (
                <li key={note} className="rounded-full border border-[#c8b69b]/20 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-[#ded3be]">
                  {note}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {saving > 0 && <span className="sr-only">Now </span>}
            <span className="font-playfair text-[19px] font-medium tracking-tight text-[#fbf7f0]">{formatPrice(item.unitPrice)}</span>
            {saving > 0 && (
              <>
                <span className="sr-only">MRP </span>
                <span className="text-xs text-[#8e918f] line-through">{formatPrice(item.mrp)}</span>
                <span className={pill}>Save {formatPrice(saving)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#c8b69b]/15 pt-3">
        <div role="group" aria-label={`Quantity of ${label}`} className="flex items-center rounded-full border border-[#c8b69b]/25 bg-[rgba(18,17,16,0.9)] p-1 shadow-inner">
          <button type="button" aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#ded3be] transition-all hover:bg-white/5 hover:text-white active:scale-95 disabled:opacity-40">
            −
          </button>
          <span className="w-8 text-center text-[13px] font-semibold text-[#fbf7f0] tabular-nums select-none" aria-live="polite">
            {item.quantity}
          </span>
          <button type="button" aria-label="Increase quantity" disabled={item.quantity >= item.maxQuantity} onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#ded3be] transition-all hover:bg-white/5 hover:text-white active:scale-95 disabled:opacity-40">
            +
          </button>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="mb-1 block text-[10px] leading-none font-semibold tracking-[0.15em] text-[#c4c7c4] uppercase">Line Total</span>
          <span className="font-playfair text-lg font-medium tracking-wide text-[#fbf7f0] tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>
      </div>
    </article>
  );
}

function Notices({ issues }: { issues: string[] }) {
  return (
    <div role="status" className="flex gap-3 rounded-xl border border-[#c8b69b]/40 bg-[#c8b69b]/10 p-4 text-[13px] text-[#e5e2e1]">
      <Icon name="badgeCheck" className="mt-0.5 h-4 w-4 shrink-0 text-[#cec5b9]" />
      <ul className="space-y-1">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
