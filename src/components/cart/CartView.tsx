'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductArt } from '@/components/product/ProductArt';
import { ProductCard } from '@/components/product/ProductCard';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import { artFor, formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import type { Product } from '@/lib/types';
import { cart, useCart, type CartLine } from './cart-store';
import { useQuote } from './useQuote';

/**
 * The bag: its items, the order summary and a few perfumes that aren't in it
 * yet. `products` is the catalogue, used for each item's type and for the
 * suggestions; prices and limits in the bag itself are re-checked against the
 * backend by `useQuote`.
 */
export function CartView({ products }: { products: Product[] }) {
  const { items, subtotal, count, ready } = useCart();
  const { issues, checking } = useQuote();
  const savings = items.reduce((total, item) => total + Math.max(0, item.mrp - item.unitPrice) * item.quantity, 0);
  const inBag = new Set(items.map((item) => item.productId));
  // One card per perfume not yet in the bag, in its first size that can be bought.
  const suggestions = products
    .filter((product) => !inBag.has(product.id))
    .flatMap((product) => {
      const variant = product.variants.find((v) => v.stockStatus !== 'out_of_stock') ?? product.variants[0];
      return variant ? [{ product, variant }] : [];
    })
    .slice(0, 4);

  return (
    <>
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-4xl text-fg md:text-5xl">Your bag</h1>
        {ready && count > 0 && (
          <p className="text-sm text-mute">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        )}
      </header>

      {!ready ? (
        <div className="mt-8 h-64 animate-pulse bg-surface" aria-busy="true" aria-label="Loading bag" />
      ) : items.length === 0 ? (
        <div className="mt-8 flex flex-col gap-6">
          {issues.length > 0 && <Notices issues={issues} />}
          <div className="bg-surface px-6 py-16 text-center">
            <p className="text-xl font-medium text-fg">Your bag is empty</p>
            <p className="mt-2 text-sm text-mute">Discover our fragrances to begin.</p>
            <ButtonLink href="/shop" className="mt-7">
              Shop perfumes
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 md:mt-8">
          {issues.length > 0 && <Notices issues={issues} />}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_23rem] lg:gap-14">
            <ul aria-label="Items in your bag" className="divide-y divide-line border-y border-line">
              {items.map((item) => (
                <li key={item.variantId}>
                  <BagItem item={item} product={products.find((product) => product.id === item.productId)} />
                </li>
              ))}
            </ul>

            <section aria-labelledby="summary-heading" className="bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
              <h2 id="summary-heading" className="text-lg font-medium text-fg">
                Order summary
              </h2>
              <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                <div className="flex items-center justify-between">
                  {/* With a saving, the first line is the full MRP so the lines add up to the total. */}
                  <dt className="text-fg-soft">{savings > 0 ? 'MRP total' : 'Subtotal'}</dt>
                  <dd className="text-fg tabular-nums">{formatPrice(subtotal + savings)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-fg-soft">You save</dt>
                    <dd className="text-success tabular-nums">− {formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-fg-soft">Delivery</dt>
                  <dd className="text-fg">Free</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <div>
                  <span className="text-base font-medium text-fg">Total</span>
                  <span className="block text-xs text-mute">Inclusive of all taxes</span>
                </div>
                <span className="text-xl font-medium text-fg tabular-nums" aria-busy={checking}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <ButtonLink href="/checkout" size="lg" className="mt-5 w-full">
                <Icon name="lock" strokeWidth={1.8} className="h-4 w-4" />
                Checkout
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-mute">Prices and availability are confirmed when you place the order.</p>
              <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-xs text-fg-soft">
                <li className="flex items-center gap-2">
                  <Icon name="truck" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
                  Free delivery within {site.policies.deliveryArea}, in {site.policies.deliveryTime}
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="returnArrow" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
                  {site.policies.returnWindowDays}-day returns on unopened products
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="lock" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
                  Secure payment by UPI, card or net banking
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {ready && suggestions.length > 0 && (
        <section aria-labelledby="suggestions-heading" className="mt-14 md:mt-20">
          <h2 id="suggestions-heading" className="font-display text-3xl text-fg md:text-4xl">
            You may also like
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {suggestions.map((listing) => (
              <li key={listing.variant.id}>
                <ProductCard listing={listing} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function BagItem({ item, product }: { item: CartLine; product?: Product }) {
  const href = `/products/${item.slug}`;
  const saving = Math.max(0, item.mrp - item.unitPrice);
  const label = `${item.name} ${item.sizeMl} ml`;
  const stepper = 'flex h-9 w-9 items-center justify-center text-base text-fg transition-colors hover:bg-surface disabled:opacity-35';
  return (
    <article className="flex gap-4 py-5 sm:gap-6">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block h-32 w-24 shrink-0 overflow-hidden bg-surface sm:h-40 sm:w-32">
        {item.image ? <Image src={item.image.src} alt="" fill sizes="260px" quality={85} className="object-cover" /> : <ProductArt art={artFor(item.slug)} name={item.name} className="h-full w-full" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-medium tracking-normal text-fg">
              <Link href={href} className="hover:underline">
                {item.name}
              </Link>
            </h2>
            <p className="mt-0.5 text-sm text-mute">
              {product?.concentration ? `${product.concentration} · ` : ''}
              {item.sizeMl} ml
            </p>
          </div>
          <p className="shrink-0 text-right text-base font-medium text-fg tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="text-fg-soft">{formatPrice(item.unitPrice)} each</span>
          {saving > 0 && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-xs text-mute line-through">{formatPrice(item.mrp)}</span>
            </>
          )}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div role="group" aria-label={`Quantity of ${label}`} className="flex items-center rounded-[2px] border border-line">
            <button type="button" aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)} className={stepper}>
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-fg tabular-nums select-none" aria-live="polite">
              {item.quantity}
            </span>
            <button type="button" aria-label="Increase quantity" disabled={item.quantity >= item.maxQuantity} onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)} className={stepper}>
              +
            </button>
          </div>
          <button type="button" onClick={() => cart.remove(item.variantId)} className="text-xs font-medium tracking-[0.08em] text-mute uppercase underline underline-offset-4 transition-colors hover:text-danger">
            Remove<span className="sr-only"> {label}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function Notices({ issues }: { issues: string[] }) {
  return (
    <div role="status" className="border border-line bg-gold-soft p-4 text-sm text-fg">
      <ul className="space-y-1">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
