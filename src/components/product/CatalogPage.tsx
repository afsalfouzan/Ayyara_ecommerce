import { clsx } from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { getBestSellerIds, type Listing } from '@/lib/catalog';
import { collections } from '@/lib/site';
import { CatalogListings } from './CatalogListings';

const TABS = [{ href: '/shop', label: 'All' }, ...collections.map((c) => ({ href: `/shop/${c.slug}`, label: c.title })), { href: '/offers', label: 'Offers' }];

/** Shared layout for the shop, collection, offers and search pages: a heading, the collection tabs, then the perfumes. */
export async function CatalogPage({ eyebrow, title, intro, listings, current, crumbs, empty, children }: { eyebrow: string; title: string; intro?: string; listings: Listing[]; current?: string; crumbs: { name: string; href: string }[]; empty: ReactNode; children?: ReactNode }) {
  const rankedIds = await getBestSellerIds();
  return (
    <Container className="pt-5 pb-16 sm:pt-8 md:pb-24">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, ...crumbs]} />

      <header className="mt-6 max-w-2xl md:mt-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl text-fg md:text-6xl">{title}</h1>
        {intro && <p className="mt-3 text-base leading-relaxed text-fg-soft">{intro}</p>}
      </header>

      {children}

      {current !== undefined && (
        <nav aria-label="Collections" className="-mx-4 mt-6 overflow-x-auto border-b border-line [scrollbar-width:none] sm:mx-0 md:mt-8 [&::-webkit-scrollbar]:hidden">
          <ul className="flex min-w-max gap-6 px-4 sm:px-0">
            {TABS.map((tab) => {
              const active = current === tab.href;
              return (
                <li key={tab.href}>
                  <Link href={tab.href} aria-current={active ? 'page' : undefined} className={clsx('-mb-px block border-b-2 py-3 text-xs font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors', active ? 'border-fg text-fg' : 'border-transparent text-mute hover:text-fg')}>
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <CatalogListings listings={listings} rankedIds={rankedIds} empty={empty} />
    </Container>
  );
}

export function EmptyMessage({ title, body }: { title: string; body: ReactNode }) {
  return (
    <>
      <p className="text-xl font-medium text-fg">{title}</p>
      <p className="mt-2 text-sm text-mute">{body}</p>
    </>
  );
}
