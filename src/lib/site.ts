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

  credit: 'Digitalroots',

  policies: {
    freeShippingThresholdPaise: 0,
    dispatchWindow: '1–2 business days',
    deliveryWindow: '3–7 business days across India',
    returnWindowDays: 7,
  },
} as const;

/** Collections customers can browse; each has its own page under /shop. */
export const collections = [
  { slug: 'men', label: 'Men', title: 'Mens Collections', line: 'Strength and refinement, captured in a bottle', sub: 'Discover the scent that speaks for you' },
  { slug: 'women', label: 'Women', title: 'Womens Collections', line: 'Delicate power that lingers from day to night.', sub: 'The perfect scent to complement your aura' },
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

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
