import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { ListingCard } from '@/components/product/ListingCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantPicker } from '@/components/product/VariantPicker';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { cheapestVariant, getProductBySlug, getProducts, getRelatedProducts, listingsOf, paragraphs } from '@/lib/catalog';
import { toRupeeString } from '@/lib/format';
import { absoluteUrl, site } from '@/lib/site';
import type { Product } from '@/lib/types';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    // API unavailable at build time: pages are rendered on first request instead.
    return [];
  }
}

function seoTitle(product: Product) {
  return product.seo.title || `${product.name} ${product.concentration} ${product.variants.map((v) => `${v.sizeMl} ml`).join(' / ')}`;
}

function seoDescription(product: Product) {
  return product.seo.description || `${paragraphs(product.description)[0] ?? product.name}`.slice(0, 160);
}

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Fragrance not found', robots: { index: false } };
  const url = `/products/${product.slug}`;
  const image = product.images[0];
  return {
    title: seoTitle(product),
    description: seoDescription(product),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: seoTitle(product),
      description: seoDescription(product),
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
  };
}

// The product is resolved before any Suspense boundary so unknown slugs get a
// real HTTP 404 (not a streamed 200 + noindex), which is what search engines expect.
export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.slug);
  const description = paragraphs(product.description);
  const notes = product.notes && (product.notes.top.length || product.notes.heart.length || product.notes.base.length) ? product.notes : null;

  return (
    <>
      <Container className="pt-6 pb-20 sm:pt-10">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Shop', href: '/shop' },
            { name: product.name, href: `/products/${product.slug}` },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div className="lg:py-6">
            <p className="eyebrow">{product.concentration}</p>
            <h1 className="mt-4 text-5xl leading-[1.02] sm:text-6xl">{product.name}</h1>
            {product.tagline && <p className="mt-4 font-display text-xl text-fg-soft italic">{product.tagline}</p>}
            {description[0] && <p className="mt-6 leading-relaxed text-fg-soft">{description[0]}</p>}

            <div className="mt-8">
              <VariantPicker product={product} />
            </div>

            <div className="mt-10 border-t border-line">
              {description.length > 1 && (
                <Disclosure title="Description" defaultOpen>
                  {description.slice(1).map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </Disclosure>
              )}
              {notes && (
                <Disclosure title="Fragrance notes" defaultOpen={description.length <= 1}>
                  <dl className="grid gap-5 sm:grid-cols-3">
                    {(['top', 'heart', 'base'] as const).map((tier) =>
                      notes[tier].length ? (
                        <div key={tier}>
                          <dt className="label text-gold-bright">{tier}</dt>
                          <dd className="mt-2">{notes[tier].join(', ')}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                </Disclosure>
              )}
              <Disclosure title="Delivery & returns">
                <p>
                  Free delivery across India. Dispatched within {site.policies.dispatchWindow}; delivered in {site.policies.deliveryWindow}. Unopened products can be returned within{' '}
                  {site.policies.returnWindowDays} days of delivery.{' '}
                  <Link href="/shipping-returns" className="underline underline-offset-4">
                    Full policy
                  </Link>
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-surface/50">
          <Container className="py-20">
            <h2 id="related-heading" className="text-center font-display text-3xl font-light tracking-wider text-white sm:text-4xl">
              You may also like
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-stone-700" aria-hidden />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {listingsOf(related).slice(0, 4).map((listing) => (
                <ListingCard key={listing.variant.id} listing={listing} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
    </>
  );
}

const AVAILABILITY = {
  in_stock: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  out_of_stock: 'https://schema.org/OutOfStock',
} as const;

/** One Offer per size, so search engines see each size's price and availability. */
function productJsonLd(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const cheapest = cheapestVariant(product);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: seoDescription(product),
    sku: cheapest ? `AR-${cheapest.id}` : undefined,
    brand: { '@type': 'Brand', name: site.name },
    image: product.images.length ? product.images.map((image) => image.src) : [absoluteUrl('/icon.svg')],
    url,
    offers: product.variants.map((variant) => ({
      '@type': 'Offer',
      sku: `AR-${variant.id}`,
      name: `${product.name} ${variant.sizeMl} ml`,
      url,
      priceCurrency: site.currency,
      price: toRupeeString(variant.pricePaise),
      availability: AVAILABILITY[variant.stockStatus],
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: site.name },
    })),
  };
}

function Disclosure({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="label flex cursor-pointer items-center justify-between py-5 text-fg">
        {title}
        <ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={1.25} />
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-fg-soft">{children}</div>
    </details>
  );
}
