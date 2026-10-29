import type { Metadata } from 'next';
import { CatalogPage, EmptyMessage, SHOP_HEADING } from '@/components/product/CatalogPage';
import { getProducts, listingsOf } from '@/lib/catalog';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Shop All Perfumes',
  description: 'Shop every Ayyara Rebirth extrait de parfum perfume for men, women and unisex, with 40–50% perfume oil. Secure online payment and free delivery within Kerala.',
  alternates: { canonical: '/shop' },
  openGraph: shareMeta('/shop', { title: 'Shop All Perfumes | Ayyara Rebirth' }),
};

export default async function ShopPage() {
  const listings = listingsOf(await getProducts());
  return (
    <CatalogPage
      {...SHOP_HEADING}
      about="Shop every Ayyara Rebirth perfume in one place. All of them are extrait de parfum, made with 40–50% perfume oil, and come in more than one size for men, women and everyone. Each perfume page lists its concentration, sizes and price. Compare prices, sizes and who each is made for, then order online with free delivery within Kerala and returns on unopened bottles within 7 days."
      listName="All perfumes"
      listings={listings}
      current="/shop"
      crumbs={[{ name: 'Shop', href: '/shop' }]}
      empty={<EmptyMessage title="The collection is being restocked." body="Please check back soon." />}
    />
  );
}
