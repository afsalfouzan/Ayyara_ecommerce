import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/catalog';
import { artFor, discountPercent, formatPrice } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import { ProductArt } from './ProductArt';

/**
 * Product card used across the shop: a tall ivory tile with the photo, then
 * the type and size, the name, the price and Add to bag. It fills its grid
 * column, so the grid decides how big it is.
 */
export function ProductCard({ listing, priority = false, headingLevel: Heading = 'h3' }: { listing: Listing; priority?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const { product, variant } = listing;
  const percentOff = discountPercent(variant.mrpPaise, variant.pricePaise);
  const soldOut = variant.stockStatus === 'out_of_stock';
  const photo = product.images[0];
  const href = `/products/${product.slug}`;
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[4/5] w-full overflow-hidden bg-surface">
        {photo ? (
          // The tall tile crops the sides of a 4:3 photo, so it needs about 1.7 times its own width in pixels.
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 42vw, (min-width: 640px) 56vw, 85vw" quality={85} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full" />
        )}
        {(soldOut || percentOff > 0) && <span className="absolute top-2.5 left-2.5 bg-canvas px-2 py-1 text-[10px] font-medium tracking-[0.08em] text-fg uppercase sm:top-3 sm:left-3">{soldOut ? 'Sold out' : `${percentOff}% off`}</span>}
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <p className="truncate text-[11px] tracking-[0.08em] text-mute uppercase">
          {product.concentration} · {variant.sizeMl} ml
        </p>
        <Heading className="mt-1 truncate text-sm font-medium tracking-normal text-fg sm:text-base">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          {percentOff > 0 && <span className="sr-only">Now </span>}
          <span className="font-medium text-fg">{formatPrice(variant.pricePaise)}</span>
          {percentOff > 0 && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-xs text-mute line-through">{formatPrice(variant.mrpPaise)}</span>
            </>
          )}
        </p>
        <div className="mt-auto pt-3">
          <AddToCartButton listing={listing} />
        </div>
      </div>
    </article>
  );
}
