import { Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CatalogPage, EmptyMessage } from '@/components/product/CatalogPage';
import { getProducts, listingsOf, searchProducts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Search',
  // Result pages are thin and endless; keep them out of search engines.
  robots: { index: false, follow: true },
};

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Results searchParams={searchParams} />
    </Suspense>
  );
}

async function Results({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? '';
  const listings = query ? listingsOf(searchProducts(await getProducts(), query)) : [];
  return (
    <CatalogPage
      eyebrow="Search"
      title={query ? `“${query}”` : 'Search'}
      listings={listings}
      crumbs={[{ name: 'Search', href: '/search' }]}
      empty={
        <EmptyMessage
          title={query ? 'No perfumes match your search.' : 'What are you looking for?'}
          body={
            <>
              Try another word, or browse{' '}
              <Link href="/shop" className="text-fg underline underline-offset-4">
                all perfumes
              </Link>
              .
            </>
          }
        />
      }
    >
      <form action="/search" className="mt-6 flex max-w-xl items-center gap-3 border border-line bg-canvas px-4 focus-within:border-fg">
        <Search className="size-4 shrink-0 text-mute" aria-hidden />
        <label htmlFor="search-page-q" className="sr-only">
          Search fragrances
        </label>
        <input id="search-page-q" name="q" type="search" defaultValue={query} placeholder="Search fragrances…" className="h-12 flex-1 bg-transparent text-sm text-fg placeholder:text-mute focus:outline-none" />
      </form>
    </CatalogPage>
  );
}
