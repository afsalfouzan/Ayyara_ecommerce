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
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  listingsOf,
  paragraphs,
  PLACEHOLDER_SLUG,
} from "@/lib/catalog";
import { collections, site } from "@/lib/site";
import { productJsonLd } from "@/lib/structured-data";
import type { Product } from "@/lib/types";
import { clip, DESCRIPTION_MAX, shareMeta, TITLE_MAX, twitterMeta } from "@/lib/seo";

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

/** Room left for the title once the layout adds " | Ayyara Rebirth". */
const TITLE_ROOM = TITLE_MAX - ` | ${site.name}`.length;

/** The admin's SEO title if set, otherwise name, concentration and sizes: "Ayyara One Eau de Parfum 60 ml". */
function seoTitle(product: Product) {
  const sizes = product.variants.map((v) => `${v.sizeMl} ml`).join(" / ");
  const full = product.seo.title || `${product.name} ${product.concentration} ${sizes}`;
  // With many sizes, drop them before cutting the name.
  return clip(full.length <= TITLE_ROOM || product.seo.title ? full : `${product.name} ${product.concentration}`, TITLE_ROOM);
}

/** The admin's SEO description if set, otherwise the first paragraph of the description. */
function seoDescription(product: Product) {
  return clip(
    product.seo.description || paragraphs(product.description)[0] || `${product.name} ${product.concentration} by ${site.name}.`,
    DESCRIPTION_MAX,
  );
}

/** The collection a perfume belongs to, for its breadcrumb. */
function collectionOf(product: Product) {
  return collections.find((collection) => collection.slug === product.gender);
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product)
    return { title: "Fragrance not found", robots: { index: false } };
  const url = `/products/${product.slug}`;
  const title = seoTitle(product);
  const description = seoDescription(product);
  return {
    title,
    description,
    alternates: { canonical: url },
    // The share image is the generated card in ./opengraph-image.tsx: the perfume's own photo with its name and price.
    openGraph: { ...shareMeta(url, { title, image: false }), description },
    twitter: twitterMeta({ title, description, image: `${url}/opengraph-image` }),
  };
}

const NOTE_TIERS = [
  { tier: "top", label: "Top notes" },
  { tier: "heart", label: "Heart notes" },
  { tier: "base", label: "Base notes" },
] as const;

// The product is resolved before anything streams (there is deliberately no
// loading.tsx here), so an unknown slug gets a real HTTP 404, and crawlers that
// don't run JavaScript get the whole page in order rather than streamed in after the footer.
export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const collection = collectionOf(product);
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
            ...(collection ? [{ name: collection.title, href: `/shop/${collection.slug}` }] : []),
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

      <JsonLd data={productJsonLd(product, seoDescription(product))} />
    </>
  );
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
