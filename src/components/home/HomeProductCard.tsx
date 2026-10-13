import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductArt } from '@/components/product/ProductArt';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';
import { artFor, formatPrice } from '@/lib/format';

const GENDER_LABEL = { men: 'For Him', women: 'For Her', unisex: 'Unisex' } as const;

/**
 * Product card for the home page, about a third of a phone screen tall: the
 * photo on the left, then the perfume's name, its leading notes, price and Add
 * to bag. Everything shown comes from the catalogue, so a perfume without
 * notes or a tagline simply leaves that line out.
 */
export function HomeProductCard({ listing }: { listing: Listing }) {
  const { product, variant } = listing;
  const saving = variant.mrpPaise - variant.pricePaise;
  const photo = product.images[0];
  const href = `/products/${product.slug}`;
  const notes = product.notes ? [product.notes.top[0], product.notes.heart[0], product.notes.base[0]].filter(Boolean) : [];
  const line = notes.length ? notes.join(' • ') : product.tagline;
  return (
    <article className="card-noir group relative flex h-[clamp(260px,33svh,300px)] w-full max-w-[335px] overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(207,190,158,0.12)]">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block w-[120px] shrink-0 overflow-hidden bg-[#0e0e0e]">
        {photo ? (
          // A tall, narrow crop: the photo is drawn at the card's height, about 400 px wide before cropping.
          <Image src={photo.src} alt="" fill sizes="400px" quality={85} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e0e0e]/70" />
        {product.concentration && (
          <span className="chip-noir absolute bottom-3 left-1/2 max-w-[104px] -translate-x-1/2 truncate rounded-xl px-2 py-1 text-[8px] font-semibold tracking-wider whitespace-nowrap text-[#eae1d5] uppercase shadow-sm">{product.concentration}</span>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[9px] font-medium tracking-[0.22em] text-champagne uppercase">{GENDER_LABEL[product.gender]}</span>
          <span className="shrink-0 text-[10px] tracking-wide text-sand/70">{variant.sizeMl}ml Flacon</span>
        </div>
        <h3 className="mt-1.5 truncate font-playfair text-[22px] leading-tight tracking-tight text-[#f7f5f0]">
          <Link href={href} className="transition-colors hover:text-champagne">
            {product.name}
          </Link>
        </h3>
        {line && <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed font-light text-mist/90 italic">{line}</p>}
        <div className="rule-champagne my-3 shrink-0" />
        <div className="flex flex-wrap items-baseline gap-x-2">
          {saving > 0 && <span className="sr-only">Now </span>}
          <span className="font-playfair text-lg text-champagne">{formatPrice(variant.pricePaise)}</span>
          {saving > 0 && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-[11px] text-[#8e918f] line-through">{formatPrice(variant.mrpPaise)}</span>
            </>
          )}
        </div>
        {saving > 0 && (
          <p className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold tracking-[0.16em] text-champagne/90 uppercase">
            <Icon name="tag" strokeWidth={2} className="h-2.5 w-2.5 shrink-0" />
            Save {formatPrice(saving)}
          </p>
        )}
        <div className="mt-auto pt-2">
          <AddToCartButton listing={listing} tone="champagne" compact />
        </div>
      </div>
    </article>
  );
}
