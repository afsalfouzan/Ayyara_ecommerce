import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CatalogPage, EmptyMessage } from '@/components/product/CatalogPage';
import { getProducts, inCollection, listingsOf } from '@/lib/catalog';
import { collections } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

const find = (slug: string) => collections.find((c) => c.slug === slug);

export async function generateMetadata({ params }: PageProps<'/shop/[collection]'>): Promise<Metadata> {
  const collection = find((await params).collection);
  if (!collection) return {};
  return {
    title: collection.title,
    description: `${collection.line} Shop Ayyara Rebirth ${collection.label.toLowerCase()} fragrances online.`,
    alternates: { canonical: `/shop/${collection.slug}` },
    openGraph: shareMeta(`/shop/${collection.slug}`, { title: `${collection.title} | Ayyara Rebirth` }),
  };
}

export default async function CollectionPage({ params }: PageProps<'/shop/[collection]'>) {
  const collection = find((await params).collection);
  if (!collection) notFound();
  const listings = listingsOf((await getProducts()).filter((p) => inCollection(p, collection.slug)));
  return (
    <CatalogPage
      eyebrow="Collection"
      title={collection.title}
      intro={`${collection.line} ${collection.sub}.`}
      listings={listings}
      current={`/shop/${collection.slug}`}
      crumbs={[
        { name: 'Shop', href: '/shop' },
        { name: collection.label, href: `/shop/${collection.slug}` },
      ]}
      empty={
        <EmptyMessage
          title="New arrivals are on their way."
          body={
            <>
              Meanwhile, explore{' '}
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
