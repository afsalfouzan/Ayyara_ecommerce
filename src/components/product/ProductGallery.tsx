'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/icons';
import { artFor } from '@/lib/format';
import type { Product } from '@/lib/types';
import { ProductArt } from './ProductArt';

const chip = 'flex items-center gap-1.5 rounded-xl bg-[#0e0e0e]/85 px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase shadow-md backdrop-blur-md';
const arrow =
  'absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#444845]/30 bg-[#0e0e0e]/80 text-[#e5e2e1] shadow-lg backdrop-blur-md transition-all hover:border-[#cec5b9]/50 hover:text-[#cec5b9] active:scale-95';

/**
 * The product's photos: one large frame with labels laid over it, arrows and a
 * counter when there is more than one photo, and a strip of thumbnails beneath.
 * Falls back to the illustrated bottle until photos are uploaded.
 */
export function ProductGallery({ product }: { product: Pick<Product, 'name' | 'slug' | 'images' | 'concentration'> }) {
  const [active, setActive] = useState(0);
  const count = product.images.length;
  const image = product.images[Math.min(active, Math.max(0, count - 1))];
  const step = (by: number) => setActive((current) => (current + by + count) % count);

  return (
    <section aria-label="Photos" className="flex w-full flex-col bg-[#0e0e0e] lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[#c8b69b]/15">
      <div className="relative flex aspect-[4/4.5] w-full items-center justify-center overflow-hidden bg-[#0e0e0e]">
        {image ? (
          // The frame is a little taller than it is wide and the photos are 4:3, so the photo is drawn at about 1.5 times the frame's width.
          <Image key={image.src} src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 80vw, 150vw" quality={85} loading="eager" fetchPriority="high" className="h-full w-full animate-[fade-in_0.3s_ease-out] object-cover" />
        ) : (
          <ProductArt art={artFor(product.slug)} name={product.name} className="h-full w-full" />
        )}

        <div className="pointer-events-none absolute top-4 left-5 z-10 flex flex-col gap-2">
          {product.concentration && (
            <span className={clsx(chip, 'text-[#cec5b9]')}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#cec5b9]" />
              {product.concentration}
            </span>
          )}
          <span className={clsx(chip, 'text-[#e5e2e1]')}>
            <Icon name="badgeCheck" strokeWidth={2} className="h-3 w-3 text-[#cec5b9]" />
            Complimentary 2ml Vial
          </span>
        </div>

        {count > 1 && (
          <>
            <span className="pointer-events-none absolute top-4 right-5 z-10 rounded-xl border border-[#444845]/30 bg-[#0e0e0e]/85 px-2.5 py-1 text-[11px] font-semibold tracking-widest text-[#cec5b9] shadow-md backdrop-blur-md" aria-live="polite">
              {active + 1} / {count}
            </span>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={clsx(arrow, 'left-3')}>
              <Icon name="chevronDown" strokeWidth={2} className="h-5 w-5 rotate-90" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => step(1)} className={clsx(arrow, 'right-3')}>
              <Icon name="chevronDown" strokeWidth={2} className="h-5 w-5 -rotate-90" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="flex items-center gap-2.5 overflow-x-auto bg-[#1c1b1b] px-5 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {product.images.map((photo, index) => (
            <li key={photo.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${count}`}
                aria-current={index === active}
                className={clsx('relative block h-16 w-16 overflow-hidden rounded-lg bg-[#201f1f] p-0.5 transition-all', index === active ? 'opacity-100 ring-1 ring-[#cec5b9]' : 'opacity-60 hover:opacity-100')}
              >
                <span className="relative block h-full w-full overflow-hidden rounded">
                  <Image src={photo.src} alt="" fill sizes="160px" className="object-cover" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
