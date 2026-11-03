'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { Icon } from '@/components/ui/icons';
import { artFor } from '@/lib/format';
import type { Product, ProductImage } from '@/lib/types';
import { ProductArt } from './ProductArt';

/** One photo in a square frame on soft white. The whole photo always shows; nothing is cropped. */
function Frame({ image, sizes, priority = false, fade = false }: { image: ProductImage; sizes: string; priority?: boolean; fade?: boolean }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-surface">
      <Image key={image.src} src={image.src} alt={image.alt} fill sizes={sizes} quality={85} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className={`object-contain${fade ? ' animate-[pdp-image-in_0.4s_var(--ease-luxe)]' : ''}`} />
    </div>
  );
}

const arrow = 'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/90 text-fg shadow-sm transition-colors hover:bg-canvas';

/**
 * The product's photos.
 * Phones: one photo edge to edge in a square frame, with round arrows on it, a "2 / 5" counter in its corner, a swipe
 * to change it and a row of thumbnails beneath.
 * Tablets and laptops: a lookbook. One large photo, then the rest below it two to a row with small even gaps,
 * and the page scrolls through them. Falls back to the illustrated bottle until photos are uploaded.
 */
export function ProductGallery({ product }: { product: Pick<Product, 'name' | 'slug' | 'images'> }) {
  const [active, setActive] = useState(0);
  const swipeStart = useRef<number | null>(null);
  const count = product.images.length;

  // The large photo is the phones' slider and the lookbook's first photo. On a wider screen it is always the first one.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 640px)');
    const reset = () => wide.matches && setActive(0);
    wide.addEventListener('change', reset);
    return () => wide.removeEventListener('change', reset);
  }, []);

  const step = (by: number) => setActive((current) => (current + by + count) % count);
  const onTouchStart = (event: TouchEvent) => {
    swipeStart.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: TouchEvent) => {
    const from = swipeStart.current;
    const to = event.changedTouches[0]?.clientX;
    swipeStart.current = null;
    if (count > 1 && from !== null && to !== undefined && Math.abs(to - from) > 40) step(to < from ? 1 : -1);
  };

  const main = product.images[active] ?? product.images[0];
  const rest = product.images.slice(1);
  // An odd photo left over takes the whole last row, so the grid ends square.
  const lastSpans = rest.length % 2 === 1;
  const half = '(min-width: 1280px) 302px, (min-width: 1024px) 27vw, 45vw';
  const full = '(min-width: 1280px) 616px, (min-width: 1024px) 55vw, (min-width: 640px) 92vw, 100vw';

  return (
    <section aria-label="Photos" className="-mx-5 flex flex-col gap-2 sm:mx-0">
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative">
        {main ? <Frame image={main} sizes={full} priority={active === 0} fade={active !== 0} /> : <ProductArt art={artFor(product.slug)} name={product.name} className="aspect-square w-full" />}
        {count > 1 && (
          <div className="sm:hidden">
            <span className="absolute right-3 bottom-3 z-10 bg-canvas/90 px-2 py-1 text-[11px] font-medium tracking-[0.08em] text-fg" aria-live="polite">
              {active + 1} / {count}
            </span>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={clsx(arrow, 'left-3')}>
              <Icon name="chevronDown" strokeWidth={1.8} className="h-5 w-5 rotate-90" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => step(1)} className={clsx(arrow, 'right-3')}>
              <Icon name="chevronDown" strokeWidth={1.8} className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        )}
      </div>

      {/* Phones: the thumbnails line up with the page text, and the active one has a gold outline. */}
      {count > 1 && (
        <ul className="flex gap-3 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
          {product.images.map((photo, index) => (
            <li key={photo.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${count}`}
                aria-current={index === active}
                className={clsx('relative block h-16 w-16 overflow-hidden rounded-[3px] bg-surface outline-offset-[3px] transition-[opacity,outline-color] duration-300', index === active ? 'outline outline-1 outline-gold' : 'opacity-55 outline outline-1 outline-transparent hover:opacity-100')}
              >
                <Image src={photo.src} alt="" fill sizes="64px" className="object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <ul className="hidden grid-cols-2 gap-2 sm:grid">
          {rest.map((photo, index) => {
            const spans = lastSpans && index === rest.length - 1;
            return (
              <li key={photo.src} className={spans ? 'col-span-2' : undefined}>
                <Frame image={photo} sizes={spans ? full : half} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
