import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/catalog';
import { artFor, formatPrice } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import { ProductArt } from './ProductArt';

/**
 * Product card used across the shop. The photo does the work: a tall white
 * tile, then the name in the serif, one quiet line for type and size, the
 * price, and Add to bag. It fills its grid column, so the grid decides its size.
 */
export function ProductCard({ listing, priority = false, headingLevel: Heading = 'h3' }: { listing: Listing; priority?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const { product, variant } = listing;
  const onOffer = variant.mrpPaise > variant.pricePaise;
  const soldOut = variant.stockStatus === 'out_of_stock';
  const photo = product.images[0];
  const href = `/products/${product.slug}`;
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[4/5] w-full overflow-hidden bg-surface">
        {photo ? (
          // The tall tile crops the sides of a 4:3 photo, so it needs about 1.7 times its own width in pixels.
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 42vw, (min-width: 640px) 56vw, 85vw" quality={85} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full" />
        )}
        {soldOut && <span className="absolute top-3 left-3 bg-canvas px-2 py-1 text-[10px] font-medium tracking-[0.1em] text-fg uppercase">Sold out</span>}
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <Heading className="truncate font-display text-xl leading-tight text-fg sm:text-2xl">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1 truncate text-xs text-mute">
          {product.concentration} · {variant.sizeMl} ml
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm">
          {onOffer && <span className="sr-only">Now </span>}
          <span className="text-fg">{formatPrice(variant.pricePaise)}</span>
          {onOffer && (
            <>
              <span className="sr-only">MRP </span>
              <span className="text-xs text-mute line-through">{formatPrice(variant.mrpPaise)}</span>
            </>
          )}
        </p>
        <div className="mt-auto pt-4">
          <AddToCartButton listing={listing} />
        </div>
      </div>
    </article>
  );
}
