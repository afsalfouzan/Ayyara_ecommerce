import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import oilConcentration from "@/assets/product/oil-concentration.jpg";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ShareLink } from "@/components/product/ShareLink";
import { StickyPanel } from "@/components/product/StickyPanel";
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
import { formatPrice } from "@/lib/format";
import { collections, site } from "@/lib/site";
import { faqText, keyFacts, notesFromDescription, notesText, PERFUME_OIL, productFaqs } from "@/lib/fragrance";
import { extrasOf } from "@/lib/product-content";
import { faqJsonLd, productJsonLd } from "@/lib/structured-data";
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

/**
 * The admin's SEO description when it is a good one (120–160 characters, says "perfume"),
 * otherwise one built from the perfume's facts: name, size, oil strength, notes and price.
 */
function seoDescription(product: Product) {
  const own = product.seo.description;
  if (own && own.length >= 120 && own.length <= 160 && /perfume/i.test(own)) return own;
  const sizes = product.variants.map((v) => `${v.sizeMl} ml`).join(" / ");
  const cheapest = cheapestVariant(product);
  const found = notesFromDescription(product.description);
  const notes = found ? ` ${notesText(found.notes)}` : "";
  const price = cheapest ? ` Order online from ${formatPrice(cheapest.pricePaise)} with free delivery within ${site.policies.deliveryArea}.` : "";
  return clip(`${product.name} extrait de parfum by ${site.name}, ${sizes}, ${PERFUME_OIL} perfume oil.${notes}${price}`, DESCRIPTION_MAX);
}

/** The two columns of the page on laptops (photo about 55%, details 45%). Every section uses them, so their edges line up. */
const columns = "lg:grid-cols-[11fr_9fr] lg:gap-14";

/** Starts a group's fade-and-rise a moment after the one before it (see .pdp-rise in globals.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as React.CSSProperties;

/** Text where **a key phrase** between double asterisks is set in bold (so the shop can mark one in a description). */
function Emphasis({ text }: { text: string }) {
  return text.split("**").map((part, index) => (index % 2 === 1 ? <strong key={index} className="font-medium text-fg">{part}</strong> : part));
}

/** One of the hairline-separated sections under the buying controls: a small heading and a short paragraph. */
function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-line py-6">
      <h2 className="text-base font-medium text-fg">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-fg-soft">{children}</div>
    </section>
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
  const suggestions = await getRelatedProducts(product, 4);
  const related = listingsOf(suggestions.products).slice(0, 4);
  const found = notesFromDescription(product.description);
  const description = paragraphs(found ? found.rest : product.description);
  const rows = keyFacts(product);
  // Notes the shop has supplied win; otherwise notes written into the description. Each section shows only when it has content.
  const extras = extrasOf(product);
  const notes = extras.fragranceNotes ?? found?.notes ?? null;
  const faqs = productFaqs(product);

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

        <div className={`mt-5 grid grid-cols-1 gap-10 md:mt-8 ${columns}`}>
          {/* Phones: one photo with arrows. Tablets and laptops: a lookbook, the photos scrolling past while the details beside them stay in view. */}
          <div>
            <ProductGallery product={product} />
          </div>

          <StickyPanel>
            <div className="pdp-rise" style={rise(0)}>
              <p className="eyebrow">
                {product.concentration}
                {product.gender !== "unisex"
                  ? ` · For ${product.gender === "men" ? "him" : "her"}`
                  : " · Unisex"}
              </p>
              <h1 className="heading mt-2 text-fg">
                {product.name}
              </h1>
              <p className="mt-3 text-sm font-normal tracking-[0.08em] text-mute uppercase">
                {product.concentration} · {product.variants.map((variant) => `${variant.sizeMl} ml`).join(" / ")}
              </p>
              {product.tagline && (
                <p className="mt-2 text-base text-fg-soft">{product.tagline}</p>
              )}
            </div>

            <div className="mt-8 border-t border-line pt-8">
              <VariantPicker product={product} />
            </div>

            {description[0] && (
              <p className="pdp-rise mt-10 text-[15px] leading-relaxed text-fg-soft" style={rise(380)}>
                <Emphasis text={description[0]} />
              </p>
            )}
            <div className="pdp-rise mt-8 border-t border-line" style={rise(420)}>
              <Disclosure title="Delivery and returns">
                <p>
                  Free delivery within {site.policies.deliveryArea}. Dispatched within{" "}
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

              {/* Server-rendered text, not an image, so search engines and AI answers can read it. */}
              {notes && (
                <InfoSection title="Fragrance Notes">
                  <dl className="space-y-2">
                    {([["Top", notes.top], ["Heart", notes.heart], ["Base", notes.base]] as const)
                      .filter(([, list]) => list.length > 0)
                      .map(([label, list]) => (
                        <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-3">
                          <dt className="text-mute">{label}</dt>
                          <dd className="text-fg">{list.join(", ")}</dd>
                        </div>
                      ))}
                  </dl>
                </InfoSection>
              )}
              {extras.whoItsFor && <InfoSection title="Who It’s For"><p>{extras.whoItsFor}</p></InfoSection>}
              {extras.longevityProjection && <InfoSection title="Longevity & Projection"><p>{extras.longevityProjection}</p></InfoSection>}

              <ShareLink title={product.name} />
            </div>
          </StickyPanel>
        </div>

        {/* The facts buyers ask about, as text (not icons) so search engines and AI answers can read them. */}
        <div className={`mt-10 grid grid-cols-1 gap-12 md:mt-16 ${columns}`}>
          <section aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="heading text-fg">
              Key facts
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3.5 text-[15px] sm:grid-cols-[11rem_1fr]">
                  <dt className="text-mute">{row.label}</dt>
                  <dd className="text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
            {/* The shop's own comparison of perfume oil strength, supplied by the client. */}
            <Image
              src={oilConcentration}
              alt="Four bottles compared by perfume oil: Eau de toilette 5–15% oil, Eau de Parfum 15–20%, Parfum 20–30%, and Ayyara Perfume 40–50%"
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              className="mt-6 h-auto w-full"
            />
          </section>

          <div className="space-y-12 md:space-y-16">
            {description.length > 1 && (
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="heading text-fg">
                  About {product.name}
                </h2>
                <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-fg-soft">
                  {description.slice(1).map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}><Emphasis text={paragraph} /></p>
                  ))}
                </div>
              </section>
            )}
          <section aria-labelledby="questions-heading">
            <h2 id="questions-heading" className="heading text-fg">
              Questions about {product.name}
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <h3 className="text-base font-medium text-fg">{faq.question}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-fg">{faq.answer}</p>
                  {faq.detail && <p className="mt-1 text-[15px] leading-relaxed text-fg-soft">{faq.detail}</p>}
                </div>
              ))}
            </div>
          </section>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-surface">
          <Container className="py-12 md:py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="related-heading" className="heading mt-1 text-fg">
                  You may also like
                </h2>
              </div>
              <Link
                href="/shop"
                className="shrink-0 text-xs font-medium tracking-[0.12em] text-fg uppercase underline underline-offset-4 hover:text-gold"
              >
                Shop all
              </Link>
            </div>
            {/* The same cards as the home page best sellers, on every screen. */}
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 md:mt-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
              {related.map((listing) => (
                <li key={listing.variant.id} className="min-w-0">
                  <ProductCard listing={listing} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd data={productJsonLd(product, [...description, found ? notesText(found.notes) : ""].filter(Boolean).join(" ") || seoDescription(product))} />
      {/* The same questions and answers the page shows above. */}
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs.map((faq) => ({ question: faq.question, answer: faqText(faq) })))} />}
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
    <details className="disclosure group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-sm font-medium text-fg marker:content-none">
        {title}
        <Icon
          name="chevronDown"
          strokeWidth={1.4}
          className="h-4 w-4 shrink-0 text-mute transition-transform duration-500 ease-out group-open:rotate-180"
        />
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-fg-soft">
        {children}
      </div>
    </details>
  );
}
