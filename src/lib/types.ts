/** Money is always integer paise (₹1 = 100 paise) to avoid floating-point errors. */
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

/** Public product shape from the storefront API. Never contains cost data. */
export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  concentration: string;
  gender: 'men' | 'women' | 'unisex';
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] } | null;
  seo: { title: string | null; description: string | null };
  images: ProductImage[];
  variants: Variant[];
  updatedAt: string;
};
