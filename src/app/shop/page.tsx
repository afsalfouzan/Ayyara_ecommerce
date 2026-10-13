import type { Metadata } from 'next';
import { CatalogPage, EmptyMessage } from '@/components/product/CatalogPage';
import { getProducts, listingsOf } from '@/lib/catalog';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Shop All Perfumes',
  description: 'Shop the Ayyara Rebirth collection of fine fragrances. Secure online payment and delivery across India.',
  alternates: { canonical: '/shop' },
  openGraph: shareMeta('/shop', { title: 'Shop All Perfumes | Ayyara Rebirth' }),
};

export default async function ShopPage() {
  const listings = listingsOf(await getProducts());
  return (
    <CatalogPage
      eyebrow="Haute Parfumerie"
      title="All Perfumes"
      intro="Fine fragrances for modern you — each composed to be worn as an indelible signature, macerated in Kerala."
      listings={listings}
      current="/shop"
      crumbs={[{ name: 'Shop', href: '/shop' }]}
      empty={<EmptyMessage title="The collection is being restocked." body="Please check back soon." />}
    />
  );
}
