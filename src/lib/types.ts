/** Money is always integer paise (Rs. 1 = 100 paise) to avoid floating-point errors. */
export type Paise = number;

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type ProductImage = { src: string; alt: string; width: number; height: number };

/** A size of a perfume, e.g. 60 ml. Prices and stock are per size. */
export type Variant = {
  id: number;
  sizeMl: number;
  mrpPaise: Paise;
  pricePaise: Paise;
  stockStatus: StockStatus;
  /** Max units a customer can add (capped by stock and the per-order limit). */
  purchasableQuantity: number;
};

/** Fragrance notes by tier. */
export type FragranceNotes = { top: string[]; heart: string[]; base: string[] };

/**
 * Optional extra copy for a perfume's page. Each section appears only when it has content, so nothing is
 * shown until the shop supplies it (see product-content.ts). The API may send these too, once the admin holds them.
 */
export type ProductExtras = {
  /** Top, heart and base notes. When empty, notes written into the description are used instead. */
  fragranceNotes?: FragranceNotes | null;
  /** "Who it's for": a short paragraph. */
  whoItsFor?: string | null;
  /** "Longevity & Projection": a short paragraph. */
  longevityProjection?: string | null;
};

/** Public product shape from the storefront API. Never contains cost data. */
export type Product = ProductExtras & {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  concentration: string;
  gender: 'men' | 'women' | 'unisex';
  description: string;
  seo: { title: string | null; description: string | null };
  images: ProductImage[];
  variants: Variant[];
  updatedAt: string;
};
