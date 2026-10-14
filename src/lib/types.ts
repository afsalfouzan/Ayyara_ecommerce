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

export type Projection = 'soft' | 'moderate' | 'strong';
export type Season = 'summer' | 'monsoon' | 'winter';
export type Occasion = 'daytime' | 'office' | 'casual' | 'evening' | 'date night' | 'special occasions';

/** The fragrance profile filled in by the shop in the admin. Every field may be empty. */
export type FragranceProfile = {
  fragranceFamily: string | null;
  longevityHours: { min: number; max: number } | null;
  projection: Projection | null;
  seasons: Season[];
  occasions: Occasion[];
  similarScents: string | null;
  keyIngredients: string[];
  allergens: string | null;
  perfumer: string | null;
  launchYear: number | null;
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
  /** Missing from an API that predates the profile; read it through profileOf(). */
  profile?: FragranceProfile;
  seo: { title: string | null; description: string | null };
  images: ProductImage[];
  variants: Variant[];
  updatedAt: string;
};
