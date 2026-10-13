'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/icons';
import { artFor } from '@/lib/format';
import type { Product } from '@/lib/types';
import { ProductArt } from './ProductArt';

const arrow = 'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/90 text-fg shadow-sm transition-colors hover:bg-canvas';

/**
 * The product's photos: one large ivory frame, with arrows and a counter when
 * there is more than one photo, and a row of thumbnails beneath. Falls back to
 * the illustrated bottle until photos are uploaded.
 */
export function ProductGallery({ product }: { product: Pick<Product, 'name' | 'slug' | 'images'> }) {
  const [active, setActive] = useState(0);
  const count = product.images.length;
  const image = product.images[Math.min(active, Math.max(0, count - 1))];
  const step = (by: number) => setActive((current) => (current + by + count) % count);

  return (
    <section aria-label="Photos">
      <div className="relative aspect-square w-full overflow-hidden bg-surface sm:aspect-[4/5]">
        {image ? (
          // The frame is square or taller and the photos are 4:3, so the photo is drawn at up to 1.7 times the frame's width.
          <Image key={image.src} src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 85vw, 170vw" quality={85} loading="eager" fetchPriority="high" className="animate-[fade-in_0.3s_ease-out] object-cover" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full" />
        )}
        {count > 1 && (
          <>
            <span className="absolute right-3 bottom-3 z-10 bg-canvas/90 px-2 py-1 text-[11px] font-medium tracking-[0.08em] text-fg" aria-live="polite">
              {active + 1} / {count}
            </span>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={clsx(arrow, 'left-3')}>
              <Icon name="chevronDown" strokeWidth={1.8} className="h-5 w-5 rotate-90" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => step(1)} className={clsx(arrow, 'right-3')}>
              <Icon name="chevronDown" strokeWidth={1.8} className="h-5 w-5 -rotate-90" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {product.images.map((photo, index) => (
            <li key={photo.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${count}`}
                aria-current={index === active}
                className={clsx('relative block h-16 w-16 overflow-hidden bg-surface transition-opacity sm:h-20 sm:w-20', index === active ? 'ring-1 ring-fg ring-offset-2' : 'opacity-60 hover:opacity-100')}
              >
                <Image src={photo.src} alt="" fill sizes="200px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
