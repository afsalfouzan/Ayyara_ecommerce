import type { Metadata } from 'next';
import Link from 'next/link';
import { CatalogPage, EmptyMessage } from '@/components/product/CatalogPage';
import { getProducts, isOnOffer, listingsOf } from '@/lib/catalog';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Offers',
  description: 'Ayyara Rebirth fragrances at special prices: save on fine perfumes, with free delivery within Kerala.',
  alternates: { canonical: '/offers' },
  openGraph: shareMeta('/offers', { title: 'Offers | Ayyara Rebirth' }),
};

export default async function OffersPage() {
  const listings = listingsOf(await getProducts(), isOnOffer).sort((a, b) => b.variant.mrpPaise - b.variant.pricePaise - (a.variant.mrpPaise - a.variant.pricePaise));
  return (
    <CatalogPage
      eyebrow="Special prices"
      title="Offers"
      intro="Our signature fragrances at a little less — while stocks last."
      listings={listings}
      current="/offers"
      crumbs={[{ name: 'Offers', href: '/offers' }]}
      empty={
        <EmptyMessage
          title="No offers right now."
          body={
            <>
              Check back soon, or browse{' '}
              <Link href="/shop" className="text-fg underline underline-offset-4">
                all perfumes
              </Link>
              .
            </>
          }
        />
      }
    />
  );
}
