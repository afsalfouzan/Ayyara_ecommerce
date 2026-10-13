'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/icons';
import type { Listing } from '@/lib/catalog';
import { ShopProductCard } from './ShopProductCard';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'popularity', label: 'Popularity' },
] as const;
type Sort = (typeof SORTS)[number]['value'];

/**
 * The count, the sort menu and the product cards of a shop page. Sorting
 * happens in the browser: the page arrives in its featured order, and
 * `rankedIds` (sizes by units sold, best first) drives "Popularity".
 */
export function CatalogListings({ listings, rankedIds, empty }: { listings: Listing[]; rankedIds: number[]; empty: ReactNode }) {
  const [sort, setSort] = useState<Sort>('featured');
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  // Close the menu on a click elsewhere or on Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const rank = (listing: Listing) => {
    const index = rankedIds.indexOf(listing.variant.id);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const sorted = sort === 'price' ? [...listings].sort((a, b) => a.variant.pricePaise - b.variant.pricePaise) : sort === 'popularity' ? [...listings].sort((a, b) => rank(a) - rank(b)) : listings;
  const current = SORTS.find((option) => option.value === sort)!;

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-[#181715] px-2 py-1.5">
          <Icon name="badgeCheck" className="h-4 w-4 text-[#cbb596]" />
          <span className="text-[11px] font-semibold tracking-wider text-[#e5e2e1] uppercase">
            {listings.length} Rare {listings.length === 1 ? 'Extrait' : 'Extraits'}
          </span>
        </p>
        {listings.length > 1 && (
          <div ref={menu} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 rounded-full border border-[#c8b69b]/20 bg-[#181715] px-2 py-1.5 text-[11px] font-semibold tracking-wider text-[#dfd5c4] transition-colors hover:bg-[#2a2a2a]"
            >
              <Icon name="sort" strokeWidth={2} className="h-4 w-4 text-[#cbb596]" />
              <span className="sr-only">Sort by: </span>
              <span>{current.label}</span>
              <Icon name="chevronDown" strokeWidth={2} className={clsx('h-3.5 w-3.5 text-[#8e918f] transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
              <ul role="listbox" aria-label="Sort perfumes" className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-[#c8b69b]/20 bg-[#1a1917] py-1 shadow-2xl">
                {SORTS.map((option) => (
                  <li key={option.value} role="option" aria-selected={option.value === sort}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(option.value);
                        setOpen(false);
                      }}
                      className={clsx('flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-[#3a3939]', option.value === sort ? 'text-[#f5f3ee]' : 'text-[#c4c7c4] hover:text-white')}
                    >
                      <span>{option.label}</span>
                      {option.value === sort && <Icon name="check" strokeWidth={2} className="h-3.5 w-3.5 text-[#cbb596]" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="py-20 text-center">{empty}</div>
      ) : (
        // Two across on a phone. From there up the cards keep that size and more fit in a row.
        <div className="mt-6 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center">
          {sorted.map((listing, index) => (
            <div key={listing.variant.id} className="min-w-0 sm:w-[180px]">
              <ShopProductCard listing={listing} priority={index < 4} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
