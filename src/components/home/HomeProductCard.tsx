import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductArt } from '@/components/product/ProductArt';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';
import { artFor, formatPrice } from '@/lib/format';

const GENDER_LABEL = { men: 'For Him', women: 'For Her', unisex: 'Unisex' } as const;

/**
 * Product card for the home page: a square photo with a saving label, then the
 * perfume's name, its leading notes, price and Add to bag. Everything shown
 * comes from the catalogue, so a perfume without notes or a tagline simply
 * leaves that line out.
 */
export function HomeProductCard({ listing }: { listing: Listing }) {
  const { product, variant } = listing;
  const saving = variant.mrpPaise - variant.pricePaise;
  const photo = product.images[0];
  const href = `/products/${product.slug}`;
  const notes = product.notes ? [product.notes.top[0], product.notes.heart[0], product.notes.base[0]].filter(Boolean) : [];
  const line = notes.length ? notes.join(' • ') : product.tagline;
  return (
    <article className="card-noir group relative flex flex-col overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(207,190,158,0.12)]">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-square w-full overflow-hidden bg-[#0e0e0e]">
        {photo ? (
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" quality={85} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_45%,rgba(10,10,10,0.65)_100%)]" />
        {saving > 0 && (
          <span className="chip-noir absolute top-4 left-4 flex items-center gap-1.5 rounded-xl px-3 py-1 shadow-lg">
            <Icon name="tag" strokeWidth={2} className="h-3 w-3 text-champagne" />
            <span className="text-[9px] font-semibold tracking-[0.2em] text-champagne uppercase">Save {formatPrice(saving)}</span>
          </span>
        )}
        {product.concentration && <span className="chip-noir absolute right-4 bottom-4 rounded-xl px-2.5 py-1 text-[9px] font-semibold tracking-wider text-[#eae1d5] uppercase shadow-sm">{product.concentration}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="text-[9px] font-medium tracking-[0.25em] text-champagne uppercase">{GENDER_LABEL[product.gender]}</span>
          <span className="text-[11px] tracking-wide text-sand/70">{variant.sizeMl}ml Flacon</span>
        </div>
        <h3 className="font-playfair text-2xl tracking-tight text-[#f7f5f0]">
          <Link href={href} className="transition-colors hover:text-champagne">
            {product.name}
          </Link>
        </h3>
        {line && <p className="mt-1.5 text-xs leading-relaxed font-light text-mist/90 italic">{line}</p>}
        <div className="rule-champagne my-4" />
        <div className="mt-auto flex items-baseline gap-2.5">
          {saving > 0 && <span className="sr-only">Now </span>}
          <span className="font-playfair text-[22px] text-champagne">{formatPrice(variant.pricePaise)}</span>
          {saving > 0 && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-[13px] text-[#8e918f] line-through">{formatPrice(variant.mrpPaise)}</span>
            </>
          )}
        </div>
        <div className="mt-5">
          <AddToCartButton listing={listing} tone="champagne" />
        </div>
      </div>
    </article>
  );
}
