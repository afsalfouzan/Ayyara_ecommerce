import { clsx } from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Listing } from '@/lib/catalog';
import { collections } from '@/lib/site';
import { ListingCard } from './ListingCard';

const TABS = [{ href: '/shop', label: 'All perfumes' }, ...collections.map((c) => ({ href: `/shop/${c.slug}`, label: c.label })), { href: '/offers', label: 'Offers' }];

/** Shared layout for the shop, collection, offers and search pages. */
export function CatalogPage({ eyebrow, title, intro, listings, current, crumbs, empty, children }: { eyebrow: string; title: string; intro?: string; listings: Listing[]; current?: string; crumbs: { name: string; href: string }[]; empty: ReactNode; children?: ReactNode }) {
  return (
    <div className="px-4 pt-8 pb-24 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, ...crumbs]} />
        <div className="mt-10 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-[#c5a059] uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-wider text-white sm:text-5xl">{title}</h1>
          <div className="mx-auto mt-4 h-px w-12 bg-[#c5a059]/40" aria-hidden />
          {intro && <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed font-light text-stone-400 sm:text-base">{intro}</p>}
        </div>

        {current !== undefined && (
          <nav aria-label="Collections" className="mt-10 flex justify-center">
            <ul className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={current === tab.href ? 'page' : undefined}
                    className={clsx(
                      'block rounded-full border px-5 py-2 text-xs tracking-widest whitespace-nowrap uppercase transition-all duration-200',
                      current === tab.href
                        ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#e6c98f] font-medium shadow-sm'
                        : 'border-white/10 bg-[#141414]/70 text-stone-400 hover:border-white/30 hover:text-white',
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {children}

        <p className="mt-10 border-b border-white/10 pb-4 text-xs tracking-widest uppercase text-stone-400">
          {listings.length} {listings.length === 1 ? 'perfume' : 'perfumes'}
        </p>
        {listings.length === 0 ? (
          <div className="py-24 text-center">{empty}</div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing, index) => (
              <ListingCard key={listing.variant.id} listing={listing} priority={index < 4} headingLevel="h2" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyMessage({ title, body }: { title: string; body: ReactNode }) {
  return (
    <>
      <p className="font-display text-3xl text-white">{title}</p>
      <p className="mt-3 text-mute">{body}</p>
    </>
  );
}
