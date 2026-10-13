import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import distillation from "@/assets/shop/distillation.jpg";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ShopProductCard } from "@/components/product/ShopProductCard";
import { VariantPicker } from "@/components/product/VariantPicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon, type IconName } from "@/components/ui/icons";
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
 * Product page in the "L'Élixir Noir" style. Name, description, notes, sizes,
 * prices and photos come from the catalogue for each perfume; the house story,
 * promises and questions are the same on every perfume. The design was drawn
 * for a phone: from the `lg` breakpoint the photos sit beside the details.
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

const noteActs = [
  {
    tier: "top",
    label: "Act I : Top Notes",
    time: "0 – 30 mins (The Awakening)",
  },
  {
    tier: "heart",
    label: "Act II : Heart Notes",
    time: "2 – 6 hrs (The Soul)",
  },
  {
    tier: "base",
    label: "Act III : Base Notes",
    time: "6 – 24+ hrs (The Sillage)",
  },
] as const;

const pillars: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "shield",
    title: "Risk-Free Discovery Guarantee",
    text: "Every bottle includes a separate sealed 2ml tester vial. Test on your skin first; return the unopened flacon if it fails to captivate.",
  },
  {
    icon: "drop",
    title: "28% Pure Extrait Potency",
    text: "Double the concentration of traditional Eau de Parfum, guaranteeing enduring depth without synthetic sillage amplifiers.",
  },
  {
    icon: "truck",
    title: "Insured Atelier Courier",
    text: "Carefully cushioned in recyclable thermal sleeves and dispatched via express air courier directly from Kerala.",
  },
];

const eyebrow =
  "text-[11px] font-semibold tracking-widest text-[#cec5b9] uppercase";
const heading =
  "font-playfair text-[22px] leading-[30px] font-medium text-white md:text-[28px] md:leading-9";
const section = "px-5 sm:px-8 lg:px-12";
const inner = "mx-auto w-full max-w-7xl";

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
  const crumbs = [
    { name: "Maison", href: "/" },
    { name: "Rare Extraits", href: "/shop" },
    { name: product.name, href: `/products/${product.slug}` },
  ];
  const faqs = [
    {
      question: `How long does ${product.name} last on the skin?`,
      answer:
        "Our perfumes are composed at a high concentration, for a pronounced presence in the first hours that settles into a rich, close-to-skin trail through the day. How long a fragrance lasts varies with skin, climate and how it is applied.",
    },
    {
      question: "How does the 2ml discovery vial guarantee work?",
      answer:
        "When your parcel arrives, leave the main flacon sealed and try the enclosed 2ml discovery vial first. If the perfume is not your signature, contact us and return the unopened bottle for a refund.",
    },
    {
      question: "How should I store and wear it?",
      answer:
        "Keep the bottle away from direct sunlight and heat, with its cap on. Apply to pulse points such as the wrists and neck, on clean skin, and let it settle without rubbing.",
    },
  ];

  return (
    <div className="bg-[#131313] text-[#e5e2e1]">
      {/* Where this page sits in the shop */}
      <nav aria-label="Breadcrumb" className={`${section} bg-[#0e0e0e] py-2`}>
        <ol
          className={`${inner} flex items-center gap-1.5 truncate text-[11px] font-semibold tracking-widest uppercase`}
        >
          {crumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden className="text-[#c4c7c4]/40">
                  /
                </span>
              )}
              {index === crumbs.length - 1 ? (
                <span aria-current="page" className="truncate text-[#cec5b9]">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[#c4c7c4]/70 transition-colors hover:text-white"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Photos beside the name, price and buttons (stacked on a phone) */}
      <div className="lg:px-12 lg:pt-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div className="flex flex-col">
            <section className="flex flex-col gap-3 px-5 pt-6 pb-5 sm:px-8 lg:px-0 lg:pt-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#cec5b9] uppercase">
                  Maison de Haute Parfumerie • Kerala
                </span>
                <span className="shrink-0 rounded-xl bg-[#2a2a2a] px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#c4c7c4]">
                  Artisanal Niche
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-playfair text-[28px] leading-9 tracking-tight text-white md:text-[40px] md:leading-[48px]">
                  {product.name}{" "}
                  <span className="whitespace-nowrap">
                    {product.concentration}
                  </span>
                </h1>
                {product.tagline && (
                  <p className="font-playfair text-base text-[#cec5b9] italic">
                    {product.tagline}
                  </p>
                )}
                {description[0] && (
                  <p className="text-[13px] leading-relaxed text-[#c4c7c4] md:text-[15px]">
                    {description[0]}
                  </p>
                )}
              </div>
            </section>

            <div className="px-5 pb-6 sm:px-8 lg:px-0">
              <VariantPicker product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* The rest of the description, when the admin has more than one paragraph */}
      {description.length > 1 && (
        <section className={`${section} bg-[#131313] py-8 md:py-12`}>
          <div className={inner}>
            <div className="flex max-w-3xl flex-col gap-3">
              <span className={eyebrow}>The Composition</span>
              {description.slice(1).map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-[15px] leading-relaxed font-light text-[#c4c7c4]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The notes, in the three acts they are smelled in */}
      {notes && (
        <section className={`${section} bg-[#0e0e0e] pt-8 pb-6 md:py-14`}>
          <div className={`${inner} flex flex-col gap-5 md:gap-8`}>
            <div className="flex flex-col gap-1">
              <span className={eyebrow}>Architecture Scent Breakdown</span>
              <h2 className={heading}>The Olfactory Pyramid</h2>
              <p className="max-w-xl text-[13px] leading-5 text-[#c4c7c4] md:text-[15px] md:leading-6">
                Composed for a long dry-down, transforming across three distinct
                acts on warm skin.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-5">
              {noteActs.map((act) =>
                notes[act.tier].length ? (
                  <div
                    key={act.tier}
                    className="flex flex-col gap-2.5 rounded-xl bg-[#201f1f] p-4 lg:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#cec5b9]" />
                        <h3 className="font-sans text-[11px] font-semibold tracking-widest text-[#cec5b9] uppercase">
                          {act.label}
                        </h3>
                      </div>
                      <span className="text-xs text-[#c4c7c4]/80">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-[15px] leading-6 text-white">
                      {notes[act.tier].join(", ")}
                    </p>
                    <ul className="flex flex-wrap gap-1.5 pt-1">
                      {notes[act.tier].map((note) => (
                        <li
                          key={note}
                          className="rounded-md bg-[#353534] px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#e5e2e1]"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </section>
      )}

      {/* How the house makes its perfumes */}
      <section className={`${section} bg-[#131313] py-8 md:py-14`}>
        <div
          className={`${inner} grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-12`}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
            {/* A wide crop of a square photo, drawn at the box's full width. */}
            <Image
              src={distillation}
              alt="A copper still among glass bottles, spices and dried flowers by a window"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={85}
              placeholder="blur"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent p-4">
              <span className={eyebrow}>Veliyamthode Laboratory</span>
              <h2 className={heading}>Slow Maceration in Kerala</h2>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[15px] leading-relaxed text-[#c4c7c4] lg:text-lg lg:leading-7 lg:font-light">
              {product.name} is not blended in industrial vats. Each batch is
              made in limited volumes in our Malappuram atelier, utilizing
              cold-pressed South Indian botanicals and hand-sourced vanilla
              beans macerated in darkness for sixty cycles.
            </p>
            <dl className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                [
                  "Formula Purity",
                  "Zero Phthalates",
                  "Cruelty-free clean oils",
                ],
                ["Longevity Index", "16+ Hours", "Intimate skin sillage"],
              ].map(([label, value, note]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 rounded-lg bg-[#201f1f] p-3"
                >
                  <dt className="text-[10px] font-semibold tracking-widest text-[#cec5b9] uppercase">
                    {label}
                  </dt>
                  <dd className="text-[15px] font-semibold text-white">
                    {value}
                  </dd>
                  <dd className="text-[11px] text-[#c4c7c4]">{note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* What the house promises */}
      <section className={`${section} bg-[#0e0e0e] py-6 md:py-12`}>
        <div className={`${inner} flex flex-col gap-3 md:gap-5`}>
          <h2 className={`${eyebrow} font-sans`}>The Atelier Distinction</h2>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-3.5 rounded-xl bg-[#201f1f] p-4 md:p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] text-[#cec5b9]">
                  <Icon
                    name={pillar.icon}
                    strokeWidth={1.8}
                    className="h-5 w-5"
                  />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-sans text-[15px] leading-6 font-semibold tracking-normal text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#c4c7c4]">
                    {pillar.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className={`${section} bg-[#131313] py-6 md:py-12`}>
        <div className={inner}>
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className={eyebrow}>Frequently Inquired</span>
              <h2 className={heading}>Atelier Protocol &amp; Care</h2>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {faqs.map((faq) => (
                <Disclosure key={faq.question} title={faq.question}>
                  {faq.answer}
                </Disclosure>
              ))}
              <Disclosure title="Delivery and returns">
                Free delivery across India. Dispatched within{" "}
                {site.policies.dispatchWindow}; delivered in{" "}
                {site.policies.deliveryWindow}. Unopened products can be
                returned within {site.policies.returnWindowDays} days of
                delivery.{" "}
                <Link
                  href="/shipping-returns"
                  className="text-white underline underline-offset-4"
                >
                  Full policy
                </Link>
              </Disclosure>
            </div>
          </div>
        </div>
      </section>

      {/* Other perfumes */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className={`${section} bg-[#0e0e0e] py-8 md:py-14`}
        >
          <div className={`${inner} flex flex-col gap-4 md:gap-8`}>
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col">
                <span className={eyebrow}>The Collection</span>
                <h2 id="related-heading" className={heading}>
                  Harmonious Pairings
                </h2>
              </div>
              <Link
                href="/shop"
                className="shrink-0 pb-1 text-[11px] font-semibold tracking-widest text-[#cec5b9] uppercase transition-colors hover:text-white"
              >
                Explore All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {related.map((listing) => (
                <ShopProductCard key={listing.variant.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sign-up */}
      <section className={`${section} bg-[#131313] py-8 text-center md:py-14`}>
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#cec5b9]/10 text-[#cec5b9]">
              <Icon name="mail" strokeWidth={1.8} className="h-5 w-5" />
            </span>
            <h2 className={heading}>The Ayyara Private Circle</h2>
            <p className="mx-auto max-w-xs text-[13px] leading-5 text-[#c4c7c4]">
              Receive privileged allocations of micro-distillations, bespoke
              decants, and invitation-only atelier announcements.
            </p>
          </div>
          <div className="pt-2 text-left">
            <NewsletterForm look="circle" />
          </div>
        </div>
      </section>

      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: product.name, href: `/products/${product.slug}` },
          ].map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </div>
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
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-xl bg-[#201f1f]">
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 text-left text-[15px] leading-6 font-medium text-white">
        {title}
        <Icon
          name="chevronDown"
          strokeWidth={2}
          className="h-5 w-5 shrink-0 text-[#c4c7c4] transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="px-4 pb-4 text-[13px] leading-relaxed text-[#c4c7c4]">
        {children}
      </div>
    </details>
  );
}
