import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantPicker } from "@/components/product/VariantPicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/icons";
import {
  cheapestVariant,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  listingsOf,
  paragraphs,
  PLACEHOLDER_SLUG,
} from "@/lib/catalog";
import { toRupeeString } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";
import type { Product } from "@/lib/types";
import { shareMeta } from "@/lib/seo";

/*
 * Product page: photos beside the name, price and buying controls, then the
 * description, notes and delivery details, and a few other perfumes. Everything
 * shown about the perfume comes from the catalogue.
 */

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    if (products.length > 0)
      return products.map((product) => ({ slug: product.slug }));
  } catch {
    // API unavailable at build time: real product pages are rendered on first request instead.
  }
  // Nothing to list: give the build one stand-in address (it renders "not found").
  return [{ slug: PLACEHOLDER_SLUG }];
}

function seoTitle(product: Product) {
  return (
    product.seo.title ||
    `${product.name} ${product.concentration} ${product.variants.map((v) => `${v.sizeMl} ml`).join(" / ")}`
  );
}

function seoDescription(product: Product) {
  return (
    product.seo.description ||
    `${paragraphs(product.description)[0] ?? product.name}`.slice(0, 160)
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product)
    return { title: "Fragrance not found", robots: { index: false } };
  const url = `/products/${product.slug}`;
  return {
    title: seoTitle(product),
    description: seoDescription(product),
    alternates: { canonical: url },
    // The share image is the generated card in ./opengraph-image.tsx.
    openGraph: {
      ...shareMeta(url, { title: seoTitle(product), image: false }),
      description: seoDescription(product),
    },
  };
}

const NOTE_TIERS = [
  { tier: "top", label: "Top notes" },
  { tier: "heart", label: "Heart notes" },
  { tier: "base", label: "Base notes" },
] as const;

// The product is resolved before any Suspense boundary so unknown slugs get a
// real HTTP 404 (not a streamed 200 + noindex), which is what search engines expect.
export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = listingsOf(await getRelatedProducts(product.slug, 4)).slice(
    0,
    4,
  );
  const description = paragraphs(product.description);
  const notes =
    product.notes &&
    (product.notes.top.length ||
      product.notes.heart.length ||
      product.notes.base.length)
      ? product.notes
      : null;

  return (
    <>
      <Container className="pt-5 pb-16 sm:pt-8 md:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: product.name, href: `/products/${product.slug}` },
          ]}
        />

        <div className="mt-5 grid grid-cols-1 gap-8 md:mt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="-mx-5 sm:mx-0 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div className="lg:py-2">
            <p className="eyebrow">
              {product.concentration}
              {product.gender !== "unisex"
                ? ` · For ${product.gender === "men" ? "him" : "her"}`
                : " · Unisex"}
            </p>
            <h1 className="mt-2 text-4xl text-fg md:text-5xl">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="mt-2 text-base text-fg-soft">{product.tagline}</p>
            )}

            <div className="mt-6">
              <VariantPicker product={product} />
            </div>

            {description[0] && (
              <p className="mt-2 border-t border-line pt-6 text-[15px] leading-relaxed text-fg-soft">
                {description[0]}
              </p>
            )}

            <div className="mt-6 border-t border-line">
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
                <Disclosure
                  title="Fragrance notes"
                  defaultOpen={description.length <= 1}
                >
                  <dl className="flex flex-col gap-3">
                    {NOTE_TIERS.map(({ tier, label }) =>
                      notes[tier].length ? (
                        <div
                          key={tier}
                          className="grid grid-cols-[7rem_1fr] gap-3"
                        >
                          <dt className="text-mute">{label}</dt>
                          <dd className="text-fg">{notes[tier].join(", ")}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                </Disclosure>
              )}
              <Disclosure title="Delivery and returns">
                <p>
                  Free delivery across India. Dispatched within{" "}
                  {site.policies.dispatchWindow}; delivered in{" "}
                  {site.policies.deliveryWindow}. Unopened products can be
                  returned within {site.policies.returnWindowDays} days of
                  delivery.{" "}
                  <Link
                    href="/shipping-returns"
                    className="text-fg underline underline-offset-4"
                  >
                    Full policy
                  </Link>
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-surface">
          <Container className="py-12 md:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-heading" className="font-display text-3xl text-fg md:text-4xl">
                You may also like
              </h2>
              <Link
                href="/shop"
                className="shrink-0 text-xs font-medium tracking-[0.12em] text-fg uppercase underline underline-offset-4 hover:text-gold"
              >
                Shop all
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 md:mt-8 lg:grid-cols-4">
              {related.map((listing) => (
                <li key={listing.variant.id} className="bg-canvas p-3 sm:p-4">
                  <ProductCard listing={listing} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
    </>
  );
}

const AVAILABILITY = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
} as const;

/** One Offer per size, so search engines see each size's price and availability. */
function productJsonLd(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const cheapest = cheapestVariant(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seoDescription(product),
    sku: cheapest ? `AR-${cheapest.id}` : undefined,
    brand: { "@type": "Brand", name: site.name },
    image: product.images.length
      ? product.images.map((image) => image.src)
      : [absoluteUrl("/icon.svg")],
    url,
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      sku: `AR-${variant.id}`,
      name: `${product.name} ${variant.sizeMl} ml`,
      url,
      priceCurrency: site.currency,
      price: toRupeeString(variant.pricePaise),
      availability: AVAILABILITY[variant.stockStatus],
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
    })),
  };
}

function Disclosure({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-sm font-medium text-fg">
        {title}
        <Icon
          name="chevronDown"
          strokeWidth={1.8}
          className="h-4 w-4 shrink-0 text-mute transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-fg-soft">
        {children}
      </div>
    </details>
  );
}
