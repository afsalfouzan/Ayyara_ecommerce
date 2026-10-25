import { cacheLife, cacheTag } from 'next/cache';
import { storeApi, StoreApiError } from './api';
import type { Product } from './types';

/*
 * Catalogue data for Server Components, read from the backend and cached for a
 * few minutes. Prices and stock shown here are indicative — the backend
 * re-checks both when the bag is quoted and when the order is placed.
 */

/**
 * Every Ayyara perfume is shown with this concentration, whatever the admin holds:
 * at 40–50% perfume oil they sit above parfum, so the standard name is extrait de parfum.
 */
export const CONCENTRATION = 'Extrait de Parfum';
const withConcentration = (product: Product): Product => ({ ...product, concentration: CONCENTRATION });

export async function getProducts(): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products');
  const { items } = await storeApi<{ items: Product[] }>('/store/products');
  return items.map(withConcentration);
}

/**
 * Stand-in product address used only while building, when the shop has no
 * perfumes yet (a new staging site) or the API can't be reached. Next.js needs
 * at least one address to check the product page; this one answers "not found".
 */
export const PLACEHOLDER_SLUG = '__no-products-yet__';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products', `product:${slug}`);
  if (slug === PLACEHOLDER_SLUG) return null;
  try {
    const { product } = await storeApi<{ product: Product }>(`/store/products/${encodeURIComponent(slug)}`);
    return withConcentration(product);
  } catch (error) {
    if (error instanceof StoreApiError && error.status === 404) return null;
    throw error;
  }
}

/** Other perfumes to suggest on a product page: the same collection first, then the rest of the shop. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<{ products: Product[] }> {
  const others = (await getProducts()).filter((other) => other.slug !== product.slug);
  const rank = (other: Product) => (other.gender === product.gender || other.gender === 'unisex' ? 0 : 1);
  const products = others
    .map((other, index) => ({ other, index }))
    .sort((a, b) => rank(a.other) - rank(b.other) || a.index - b.index)
    .slice(0, limit)
    .map(({ other }) => other);
  return { products };
}

/** Lowest-priced size, used for "From ₹…" on cards and in structured data. */
export function cheapestVariant(product: Product) {
  return [...product.variants].sort((a, b) => a.pricePaise - b.pricePaise)[0];
}

export function isSoldOut(product: Product) {
  return product.variants.every((variant) => variant.stockStatus === 'out_of_stock');
}

export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** One sellable size of a perfume, as shown on a product card. */
export type Listing = { product: Product; variant: Product['variants'][number] };

export function listingsOf(products: Product[], keep: (listing: Listing) => boolean = () => true): Listing[] {
  return products.flatMap((product) => product.variants.map((variant) => ({ product, variant }))).filter(keep);
}

/** Unisex perfumes appear in the men's and women's collections as well as their own. */
export function inCollection(product: Product, collection: 'men' | 'women' | 'unisex') {
  return product.gender === collection || product.gender === 'unisex';
}

export function isOnOffer(listing: Listing) {
  return listing.variant.mrpPaise > listing.variant.pricePaise;
}

/** Best-seller ranking, most sold first (online + offline, net of returns): single sizes, and perfumes by all their sizes together. */
export type BestSellerRanking = { variantIds: number[]; productIds: number[] };

export async function getBestSellerRanking(): Promise<BestSellerRanking> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products', 'bestsellers');
  try {
    const { items, products } = await storeApi<{ items: { variantId: number }[]; products?: { productId: number }[] }>('/store/bestsellers?limit=12');
    return { variantIds: items.map((item) => item.variantId), productIds: products?.map((item) => item.productId) ?? [] };
  } catch {
    // Ranking is a nice-to-have; the section still renders from the catalogue.
    return { variantIds: [], productIds: [] };
  }
}

/**
 * Home-page best sellers: every perfume, one card each, most units sold first.
 * Perfumes that can still be bought come first, then any not sold yet, then
 * sold-out ones last. Each card shows the perfume's best-selling size that is
 * in stock. Capped at `max` so the section stays a short list as the shop grows.
 */
export function bestSellerListings(products: Product[], { variantIds, productIds }: BestSellerRanking, { max = 6 } = {}) {
  const inStock = (variant: Product['variants'][number]) => variant.stockStatus !== 'out_of_stock';
  const sizeRank = (id: number) => {
    const at = variantIds.indexOf(id);
    return at === -1 ? Infinity : at;
  };
  // An older API sends no perfume ranking; fall back to the order of their best size.
  const perfumeRank = (product: Product) => {
    const at = productIds.indexOf(product.id);
    if (at !== -1) return at;
    if (productIds.length > 0) return Infinity;
    return Math.min(...product.variants.map((v) => sizeRank(v.id)));
  };

  return products
    .map((product, index) => {
      const sizes = [...product.variants].sort((a, b) => Number(inStock(b)) - Number(inStock(a)) || sizeRank(a.id) - sizeRank(b.id));
      return { listing: { product, variant: sizes[0]! }, soldOut: isSoldOut(product), rank: perfumeRank(product), index };
    })
    .filter(({ listing }) => listing.variant)
    .sort((a, b) => Number(a.soldOut) - Number(b.soldOut) || a.rank - b.rank || a.index - b.index)
    .slice(0, max)
    .map(({ listing }) => listing);
}

/** Case-insensitive match on the perfume's name, tagline and description. */
export function searchProducts(products: Product[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return products.filter((p) => {
    const haystack = `${p.name} ${p.tagline} ${p.concentration} ${p.description}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
