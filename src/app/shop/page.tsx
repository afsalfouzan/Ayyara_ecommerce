import type { Metadata } from 'next';
import { CatalogPage, EmptyMessage } from '@/components/product/CatalogPage';
import { getProducts, listingsOf } from '@/lib/catalog';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Shop All Perfumes',
  description: 'Shop the Ayyara Rebirth collection of fine fragrances. Secure online payment and free delivery within Kerala.',
  alternates: { canonical: '/shop' },
  openGraph: shareMeta('/shop', { title: 'Shop All Perfumes | Ayyara Rebirth' }),
};

export default async function ShopPage() {
  const listings = listingsOf(await getProducts());
  return (
    <CatalogPage
      eyebrow="The collection"
      title="All Perfumes"
      intro="Fine fragrances for modern you, each composed to be worn as a signature."
      listings={listings}
      current="/shop"
      crumbs={[{ name: 'Shop', href: '/shop' }]}
      empty={<EmptyMessage title="The collection is being restocked." body="Please check back soon." />}
    />
  );
}
