'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Listing } from '@/lib/catalog';
import { ProductCard } from './ProductCard';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'popularity', label: 'Most popular' },
] as const;
type Sort = (typeof SORTS)[number]['value'];

/**
 * The count, the filters and the product cards of a shop page. Sorting and
 * filtering happen in the browser: the page arrives in its featured order, and
 * `rankedIds` (sizes by units sold, best first) drives "Most popular".
 */
export function CatalogListings({ listings, rankedIds, empty }: { listings: Listing[]; rankedIds: number[]; empty: ReactNode }) {
  const [sort, setSort] = useState<Sort>('featured');
  const [size, setSize] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const sizes = [...new Set(listings.map((listing) => listing.variant.sizeMl))].sort((a, b) => a - b);
  const rank = (listing: Listing) => {
    const index = rankedIds.indexOf(listing.variant.id);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const filtered = listings.filter((listing) => (size === 'all' || String(listing.variant.sizeMl) === size) && (!inStockOnly || listing.variant.stockStatus !== 'out_of_stock'));
  const shown =
    sort === 'price-asc'
      ? [...filtered].sort((a, b) => a.variant.pricePaise - b.variant.pricePaise)
      : sort === 'price-desc'
        ? [...filtered].sort((a, b) => b.variant.pricePaise - a.variant.pricePaise)
        : sort === 'popularity'
          ? [...filtered].sort((a, b) => rank(a) - rank(b))
          : filtered;
  const select = 'h-10 rounded-[2px] border border-line bg-canvas px-3 text-sm text-fg focus:border-fg focus:outline-none';

  if (listings.length === 0) return <div className="py-20 text-center">{empty}</div>;

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="text-sm text-mute" aria-live="polite">
          {shown.length} {shown.length === 1 ? 'perfume' : 'perfumes'}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />
            In stock
          </label>
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
          <label className="flex items-center gap-2 text-sm text-mute">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select aria-label="Sort perfumes" value={sort} onChange={(event) => setSort(event.target.value as Sort)} className={select}>
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-20 text-center text-sm text-mute">No perfumes match these filters.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {shown.map((listing, index) => (
            <li key={listing.variant.id}>
              <ProductCard listing={listing} priority={index < 4} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
