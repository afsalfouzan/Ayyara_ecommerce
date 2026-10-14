import { cheapestVariant, paragraphs } from './catalog';
import { profileOf, profileRows } from './fragrance';
import { toRupeeString } from './format';
import { absoluteUrl, site, socialProfiles } from './site';
import type { Product } from './types';

/*
 * schema.org structured data (JSON-LD), built only from the site settings in
 * site.ts and the product data from the catalogue. Nothing here is invented:
 * a field with no real value is left out rather than filled with a guess.
 *
 * Deliberately absent, because the shop has no such data:
 *   aggregateRating / review   there are no customer reviews in the catalogue
 *   Article                    the site has no blog
 *   Store / LocalBusiness      not confirmed that customers can visit the address
 */

const ORGANIZATION_ID = absoluteUrl('/#organization');
const WEBSITE_ID = absoluteUrl('/#website');

/** Google's product category for perfume, from its product taxonomy. */
const PERFUME_CATEGORY = 'Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne';

const AVAILABILITY = {
  in_stock: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  out_of_stock: 'https://schema.org/OutOfStock',
} as const;

const AUDIENCE = { men: 'male', women: 'female', unisex: 'unisex' } as const;

/** The seven-day window for unopened products, in India, as on /shipping-returns. Return fees and method aren't stated there, so they're left out. */
function returnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'IN',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: site.policies.returnWindowDays,
    merchantReturnLink: absoluteUrl('/shipping-returns'),
  };
}

/** Free delivery across India: dispatched in 1–2 working days, delivered in 3–5. */
function shippingDetails() {
  const { dispatchDays, deliveryDays, freeShippingThresholdPaise } = site.policies;
  return {
    '@type': 'OfferShippingDetails',
    // Delivery is free on every order while there is no minimum.
    ...(freeShippingThresholdPaise === 0 ? { shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: site.currency } } : {}),
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: dispatchDays.min, maxValue: dispatchDays.max, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: deliveryDays.min, maxValue: deliveryDays.max, unitCode: 'DAY' },
    },
  };
}

/** The shop as an online store, for the home page. */
export function organizationJsonLd() {
  const { openingHours } = site.contact;
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': ORGANIZATION_ID,
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/brand/ayyara-logo.png'),
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone.replace(/\s/g, ''),
    address: { '@type': 'PostalAddress', ...site.contact.postalAddress },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.contact.phone.replace(/\s/g, ''),
      email: site.contact.email,
      areaServed: 'IN',
      availableLanguage: ['English'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: openingHours.days.map((day) => `https://schema.org/${day}`),
        opens: openingHours.opens,
        closes: openingHours.closes,
      },
    },
    hasMerchantReturnPolicy: returnPolicy(),
    // Only real profile pages; the placeholders in site.ts are filtered out by socialProfiles.
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
  };
}

/** The website, with the shop's search page, for the home page. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl('/'),
    inLanguage: 'en-IN',
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** One perfume: its details, notes, and one Offer per size with price, stock, delivery and returns. */
export function productJsonLd(product: Product, description: string) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const cheapest = cheapestVariant(product);
  const profile = profileOf(product);
  // The same facts as the page's "Fragrance profile" table (filled-in fields only), except volume, which is listed per size below.
  const profileProperties = profileRows(product)
    .filter((row) => row.label !== 'Made for')
    .map((row) => ({ '@type': 'PropertyValue', name: row.label, value: row.value }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: description || paragraphs(product.description)[0] || product.name,
    url,
    ...(product.images.length ? { image: product.images.map((image) => image.src) } : {}),
    ...(cheapest ? { sku: `AR-${cheapest.id}` } : {}),
    brand: { '@type': 'Brand', name: site.name },
    category: PERFUME_CATEGORY,
    audience: { '@type': 'PeopleAudience', suggestedGender: AUDIENCE[product.gender] },
    ...(profile.launchYear ? { releaseDate: String(profile.launchYear) } : {}),
    additionalProperty: [
      ...profileProperties,
      ...product.variants.map((variant) => ({ '@type': 'PropertyValue', name: 'Volume', value: variant.sizeMl, unitCode: 'MLT', unitText: 'ml' })),
    ],
    offers: product.variants.map((variant) => ({
      '@type': 'Offer',
      sku: `AR-${variant.id}`,
      name: `${product.name} ${variant.sizeMl} ml`,
      url,
      price: toRupeeString(variant.pricePaise),
      priceCurrency: site.currency,
      // The MRP, when the selling price is below it, as the struck-through price shown on the page.
      ...(variant.mrpPaise > variant.pricePaise
        ? { priceSpecification: { '@type': 'UnitPriceSpecification', priceType: 'https://schema.org/StrikethroughPrice', price: toRupeeString(variant.mrpPaise), priceCurrency: site.currency } }
        : {}),
      availability: AVAILABILITY[variant.stockStatus],
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: site.name },
      shippingDetails: shippingDetails(),
      hasMerchantReturnPolicy: returnPolicy(),
    })),
  };
}

/** Questions and answers exactly as a page shows them; use only where they are visible. */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
