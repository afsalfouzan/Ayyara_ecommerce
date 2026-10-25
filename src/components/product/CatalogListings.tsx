'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { Listing } from '@/lib/catalog';
import { ProductCard } from './ProductCard';

/**
 * The count, the size filter and the product cards of a shop page, in the shop's own order.
 * Filtering happens in the browser.
 */
export function CatalogListings({ listings, empty }: { listings: Listing[]; empty: ReactNode }) {
  const [size, setSize] = useState('all');
  // Next.js keeps a page alive (hidden) after you leave it, so a chosen size would still be
  // applied on your return. Clear it on leaving, so a shop page always opens on every size.
  useEffect(() => () => setSize('all'), []);

  const sizes = [...new Set(listings.map((listing) => listing.variant.sizeMl))].sort((a, b) => a - b);
  const shown = listings.filter((listing) => size === 'all' || String(listing.variant.sizeMl) === size);
  const select = 'h-10 rounded-[2px] border border-line bg-canvas px-3 text-sm text-fg focus:border-fg focus:outline-none';

  if (listings.length === 0) return <div className="py-20 text-center">{empty}</div>;

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="text-sm text-mute" aria-live="polite">
          {shown.length} {shown.length === 1 ? 'perfume' : 'perfumes'}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {sizes.length > 1 && (
            <label className="flex items-center gap-2 text-sm text-mute">
              <span className="sr-only sm:not-sr-only">Size</span>
              <select aria-label="Filter by size" value={size} onChange={(event) => setSize(event.target.value)} className={select}>
                <option value="all">All sizes</option>
                {sizes.map((ml) => (
                  <option key={ml} value={ml}>
                    {ml} ml
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-20 text-center text-sm text-mute">No perfumes match these filters.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {shown.map((listing, index) => (
            <li key={listing.variant.id}>
              <ProductCard listing={listing} priority={index < 2} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
