import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/catalog';
import { artFor, formatPrice } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import { ProductArt } from './ProductArt';

/**
 * Product card for one size, as in the design's Best Sellers: photo with a
 * "Save Rs." badge, name and size, struck-through MRP, price and Add to cart.
 */
export function ListingCard({ listing, priority = false, headingLevel: Heading = 'h3' }: { listing: Listing; priority?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const { product, variant } = listing;
  const saving = variant.mrpPaise - variant.pricePaise;
  const photo = product.images[0];
  const href = `/products/${product.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-white/10 bg-[#141414] text-white transition-all duration-300 hover:border-[#c5a059]/40 hover:shadow-2xl">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-square overflow-hidden bg-[#181818]">
        {saving > 0 && <span className="absolute top-3 left-3 z-10 rounded-sm bg-[#c5a059] px-2.5 py-1 text-[10px] font-medium tracking-wider text-black uppercase shadow-sm">Save {formatPrice(saving)}</span>}
        {photo ? (
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" priority={priority} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5 text-center">
        <div>
          <Heading className="font-serif text-lg font-normal tracking-wide text-white transition-colors duration-200 group-hover:text-[#c5a059]">
            <Link href={href}>
              {product.name} – {variant.sizeMl}ml
            </Link>
          </Heading>
          <div className="mt-2 text-sm">
            {saving > 0 && (
              <>
                <span className="sr-only">MRP </span>
                <span className="mr-2 text-xs text-stone-400 line-through">{formatPrice(variant.mrpPaise)}</span>
                <span className="sr-only">now </span>
              </>
            )}
            <span className="font-medium text-white">{formatPrice(variant.pricePaise)}</span>
          </div>
        </div>
        <div className="mt-5">
          <AddToCartButton listing={listing} />
        </div>
      </div>
    </article>
  );
}
