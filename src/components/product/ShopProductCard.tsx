import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/catalog';
import { artFor, formatRupees } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import { ProductArt } from './ProductArt';

/**
 * Product card for the shop pages: a square photo with a saving label, then
 * the concentration and size, the perfume's name and leading notes, the price
 * with the percentage off, and Add to bag. It fills its grid column, so it is
 * small on a phone (two across) and its text steps up on wider screens.
 */
export function ShopProductCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const { product, variant } = listing;
  const saving = variant.mrpPaise - variant.pricePaise;
  const percentOff = saving > 0 ? Math.round((saving / variant.mrpPaise) * 100) : 0;
  const photo = product.images[0];
  const href = `/products/${product.slug}`;
  const notes = product.notes ? [product.notes.top[0], product.notes.heart[0], product.notes.base[0]].filter(Boolean) : [];
  const line = notes.length ? notes.join(' • ') : product.tagline;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#c8b69b]/20 bg-gradient-to-b from-[#161514] to-[#0f0e0e] shadow-xl transition-all duration-300 hover:border-[#c8b69b]/40">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-square w-full overflow-hidden bg-[#0e0e0e]">
        {photo ? (
          // The square card crops the sides of a 4:3 photo, so it needs about a third more pixels than its own width.
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 44vw, 66vw" quality={85} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161514] via-transparent to-transparent opacity-80" />
        {saving > 0 && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full border border-[#c8b69b]/30 bg-[#181715]/85 px-2 py-0.5 shadow-sm backdrop-blur-md md:top-3.5 md:left-3.5 md:px-3 md:py-1">
            <span className="h-1 w-1 rounded-full bg-[#cbb596]" />
            <span className="text-[9px] font-semibold tracking-[0.15em] text-[#dfd5c4] uppercase md:text-[10px]">Save {formatRupees(saving)}</span>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-2.5 p-3 md:gap-4 md:p-5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[9px] font-medium tracking-[0.2em] text-[#cbb596] uppercase md:text-[10px]">{product.concentration}</span>
            <span className="shrink-0 text-[9px] tracking-wider text-white/40 uppercase md:text-[10px]">{variant.sizeMl} ML</span>
          </div>
          <h2 className="mt-0.5 truncate font-playfair text-base leading-snug font-medium tracking-wide text-[#f5f3ee] md:mt-1 md:text-[22px]">
            <Link href={href} className="transition-colors hover:text-[#cbb596]">
              {product.name}
            </Link>
          </h2>
          {line && <p className="mt-0.5 truncate text-[11px] leading-tight text-white/60 md:mt-1 md:text-[13px]">{line}</p>}
        </div>
        <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-1 md:gap-3 md:pt-3">
          <div className="flex flex-wrap items-baseline gap-x-2">
            {saving > 0 && <span className="sr-only">Now </span>}
            <span className="font-playfair text-base font-semibold tracking-tight text-[#f5f3ee] md:text-xl">{formatRupees(variant.pricePaise)}</span>
            {saving > 0 && (
              <>
                <span className="sr-only">MRP </span>
                <span className="text-[11px] text-[#8a867e] line-through md:text-[13px]">{formatRupees(variant.mrpPaise)}</span>
                <span className="ml-auto text-[9px] font-semibold tracking-wider text-[#cbb596] uppercase md:text-[11px]">{percentOff}% off</span>
              </>
            )}
          </div>
          <AddToCartButton listing={listing} tone="champagne" compact className="md:py-3.5 md:text-[11px] md:tracking-[0.2em]" />
        </div>
      </div>
    </article>
  );
}
