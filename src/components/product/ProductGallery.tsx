'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductMedia } from './ProductMedia';

/** Main photo with thumbnails. Falls back to the illustrated bottle without photos. */
export function ProductGallery({ product }: { product: Pick<Product, 'name' | 'slug' | 'images'> }) {
  const [active, setActive] = useState(0);
  const image = product.images[active];

  return (
    <div>
      <ProductMedia product={product} image={image} priority sizes="(min-width: 1024px) 55vw, 100vw" />
      {product.images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {product.images.map((photo, index) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${product.images.length}`}
                aria-current={index === active}
                className={clsx('relative block aspect-[4/5] w-full overflow-hidden border transition-colors', index === active ? 'border-fg' : 'border-transparent opacity-75 hover:opacity-100')}
              >
                <Image src={photo.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
