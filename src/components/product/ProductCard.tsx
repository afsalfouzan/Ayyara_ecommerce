import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/catalog';
import { artFor, formatPrice } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import { QuickAddIcon } from './QuickAddIcon';
import { ProductArt } from './ProductArt';

/**
 * Product card used across the shop. The photo does the work, then the name, one quiet line for type and size, and
 * the price. It fills its grid column, so the grid decides its size.
 * Every perfume card, on every screen, looks the same: a square photo that swaps to the perfume's second photo on
 * hover (`showcase`), the MRP struck through before the price, and Add to bag as a round bag icon on the photo's
 * corner (`iconAdd`). Pass `showcase={false}` or `iconAdd={false}` to opt a card out (a tall tile, price first, and
 * a full Add to bag button).
 */
export function ProductCard({ listing, priority = false, headingLevel: Heading = 'h3', showcase = true, iconAdd = true }: { listing: Listing; priority?: boolean; headingLevel?: 'h2' | 'h3'; showcase?: boolean; iconAdd?: boolean }) {
  const { product, variant } = listing;
  const onOffer = variant.mrpPaise > variant.pricePaise;
  const soldOut = variant.stockStatus === 'out_of_stock';
  const photo = product.images[0];
  const hoverPhoto = showcase ? product.images[1] : undefined;
  const href = `/products/${product.slug}`;
  return (
    <article className="group flex h-full flex-col">
      <div className="relative">
      <Link href={href} tabIndex={-1} aria-hidden className={`relative block w-full overflow-hidden bg-surface ${showcase ? 'aspect-square' : 'aspect-[4/5]'}`}>
        {photo ? (
          // The showcase's square tile is shown at its own width; the tall tile crops the sides of a 4:3 photo, so it needs about 1.7 times that.
          <Image src={photo.src} alt={`${product.name} ${product.concentration} ${variant.sizeMl} ml bottle`} fill sizes={showcase ? '(min-width: 1024px) 27vw, (min-width: 640px) 31vw, 48vw' : '(min-width: 1024px) 42vw, (min-width: 640px) 56vw, 85vw'} quality={85} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out ${hoverPhoto ? '' : 'group-hover:scale-[1.03]'}`} />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full" />
        )}
        {hoverPhoto && (
          // The second photo is lazy and invisible until someone hovers, and only devices that can hover show it.
          <Image src={hoverPhoto.src} alt="" aria-hidden fill sizes="(min-width: 1024px) 27vw, 31vw" quality={85} loading="lazy" className="h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 max-lg:hidden" />
        )}
        {soldOut && <span className="absolute top-3 left-3 bg-canvas px-2 py-1 text-[10px] font-medium tracking-[0.1em] text-fg uppercase">Sold out</span>}
      </Link>
        {iconAdd && (
          <div className="absolute right-3 bottom-3 z-10 sm:right-4 sm:bottom-4">
            <QuickAddIcon listing={listing} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <Heading className={`truncate font-display leading-tight text-fg ${showcase ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1 truncate text-xs text-mute">
          {product.concentration} · {variant.sizeMl} ml
        </p>
        <p className={`mt-2 flex flex-wrap items-baseline text-sm ${showcase ? 'gap-x-3' : 'gap-x-2'}`}>
          {onOffer && <span className="sr-only">Now </span>}
          <span className="text-fg">{formatPrice(variant.pricePaise)}</span>
          {onOffer && (
            <>
              <span className={`sr-only${showcase ? ' order-first' : ''}`}>MRP </span>
              {/* The showcase puts the struck-through MRP first, then the price. */}
              <span className={showcase ? 'order-first text-xs text-mute line-through' : 'text-xs text-mute line-through'}>{formatPrice(variant.mrpPaise)}</span>
            </>
          )}
        </p>
        {!iconAdd && (
          <div className="mt-auto pt-4">
            <AddToCartButton listing={listing} />
          </div>
        )}
      </div>
    </article>
  );
}
