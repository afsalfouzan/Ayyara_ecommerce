/**
 * Site-wide brand and contact configuration.
 * Social profile links are placeholders until the official page URLs are added.
 */
export const site = {
  name: 'Ayyara Rebirth',
  shortName: 'Ayyara',
  tagline: 'Fine fragrances for modern you',
  description:
    'Ayyara Rebirth crafts refined eau de parfum for those who wear fragrance as a signature. Discover the collection and shop securely online.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'en_IN',
  currency: 'INR',

  contact: {
    email: 'ayyararebirthofficial@gmail.com',
    phone: '+91 8606777746',
    whatsapp: null as string | null,
    hours: 'Monday – Saturday, 10:00 – 18:00 IST',
    address: 'Veliyamthode, Chandakunnu, Malappuram, Kerala 679329, India',
  },

  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
  },


  policies: {
    freeShippingThresholdPaise: 0,
    dispatchWindow: '1–2 business days',
    // Keep in step with DELIVERY_ESTIMATE in the backend's config/store.ts (used in emails and WhatsApp messages).
    deliveryWindow: '3 to 5 working days across India',
    returnWindowDays: 7,
  },
} as const;

/** Collections customers can browse; each has its own page under /shop. */
export const collections = [
  { slug: 'men', label: 'Men', title: 'For Him', searchName: "Men's Perfumes", line: 'Strength and refinement, captured in a bottle.', sub: 'Discover the scent that speaks for you' },
  { slug: 'women', label: 'Women', title: 'For Her', searchName: "Women's Perfumes", line: 'Delicate power that lingers from day to night.', sub: 'The perfect scent to complement your aura' },
  { slug: 'unisex', label: 'Unisex', title: 'Unisex', searchName: 'Unisex Perfumes', line: 'Fragrances made to be shared.', sub: 'Worn your way, by anyone' },
] as const;

export type CollectionSlug = (typeof collections)[number]['slug'];

export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'About' },
  { href: '/offers', label: 'Offers' },
  {
    href: '/shop',
    label: 'Products',
    children: [{ href: '/shop', label: 'All perfumes' }, ...collections.map((c) => ({ href: `/shop/${c.slug}`, label: c.label }))],
  },
  { href: '/contact', label: 'Contact' },
] as const;

export const footerNav = {
  pages: [
    { href: '/', label: 'Home' },
    { href: '/our-story', label: 'About Us' },
    { href: '/shop', label: 'Products' },
  ],
  policies: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/shipping-returns', label: 'Refund And Returns Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ],
} as const;

/** Social profiles that have a real page address (the bare placeholders are left out). */
export const socialProfiles = Object.values(site.social).filter((url) => new URL(url).pathname.length > 1);

/**
 * True only for the live site. Everything else tells search engines to stay
 * away, so a test copy can never compete with the real shop in search results:
 * Vercel previews, a build that was never given its public address, and any
 * address that starts with a testing name such as staging.ayyararebirth.com.
 */
export const isLiveSite = (() => {
  if ((process.env.VERCEL_ENV ?? 'production') !== 'production') return false;
  const { hostname } = new URL(site.url);
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.vercel.app')) return false;
  return !/^(staging|stage|preview|dev|test|demo)[.-]/i.test(hostname);
})();

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
