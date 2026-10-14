import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CatalogPage, EmptyMessage } from '@/components/product/CatalogPage';
import { getProducts, inCollection, listingsOf } from '@/lib/catalog';
import { collections, site } from '@/lib/site';
import { clip, DESCRIPTION_MAX, shareMeta, twitterMeta } from '@/lib/seo';

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

const find = (slug: string) => collections.find((c) => c.slug === slug);

export async function generateMetadata({ params }: PageProps<'/shop/[collection]'>): Promise<Metadata> {
  const collection = find((await params).collection);
  if (!collection) return {};
  const title = `${collection.searchName} | ${collection.title}`;
  const description = clip(`${collection.line} Shop ${collection.searchName.toLowerCase()} by Ayyara Rebirth online, with free delivery within ${site.policies.deliveryArea}.`, DESCRIPTION_MAX);
  return {
    title,
    description,
    alternates: { canonical: `/shop/${collection.slug}` },
    openGraph: { ...shareMeta(`/shop/${collection.slug}`, { title: `${title} | Ayyara Rebirth` }), description },
    twitter: twitterMeta({ title: `${title} | Ayyara Rebirth`, description }),
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
        { name: collection.title, href: `/shop/${collection.slug}` },
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
