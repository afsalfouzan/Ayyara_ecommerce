import { cacheLife, cacheTag } from 'next/cache';
import { storeApi, StoreApiError } from './api';
import type { Product } from './types';

/*
 * Catalogue data for Server Components, read from the backend and cached for a
 * few minutes. Prices and stock shown here are indicative — the backend
 * re-checks both when the bag is quoted and when the order is placed.
 */

export async function getProducts(): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products');
  const { items } = await storeApi<{ items: Product[] }>('/store/products');
  return items;
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
    return product;
  } catch (error) {
    if (error instanceof StoreApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Other perfumes to suggest on a product page: the same fragrance family
 * first, then the same collection, then the rest of the shop.
 * `sameFamily` says whether any suggestion shares the family.
 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<{ products: Product[]; sameFamily: boolean }> {
  const others = (await getProducts()).filter((other) => other.slug !== product.slug);
  const family = product.profile?.fragranceFamily;
  const rank = (other: Product) => (family && other.profile?.fragranceFamily === family ? 0 : other.gender === product.gender || other.gender === 'unisex' ? 1 : 2);
  const products = others
    .map((other, index) => ({ other, index }))
    .sort((a, b) => rank(a.other) - rank(b.other) || a.index - b.index)
    .slice(0, limit)
    .map(({ other }) => other);
  return { products, sameFamily: Boolean(family) && products.some((other) => other.profile?.fragranceFamily === family) };
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

/** Sizes ranked by units sold (online + offline, net of returns), best first. */
export async function getBestSellerIds(): Promise<number[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products', 'bestsellers');
  try {
    const { items } = await storeApi<{ items: { variantId: number }[] }>('/store/bestsellers?limit=8');
    return items.map((item) => item.variantId);
  } catch {
    // Ranking is a nice-to-have; the section still renders from the catalogue.
    return [];
  }
}

/**
 * Home-page best sellers: at most two perfumes, one card each. A perfume is
 * shown in its best-selling size, never twice. Top sellers that can still be
 * bought come first, then sold-out top sellers; if fewer than two perfumes have
 * sold yet, other in-stock perfumes fill the gap.
 */
export function bestSellerListings(products: Product[], rankedIds: number[], { max = 2 } = {}) {
  const all = listingsOf(products);
  const byId = new Map(all.map((listing) => [listing.variant.id, listing]));
  const ranked = rankedIds.flatMap((id) => byId.get(id) ?? []);
  const inStock = (listing: Listing) => listing.variant.stockStatus !== 'out_of_stock';
  const candidates = [...ranked.filter(inStock), ...ranked.filter((l) => !inStock(l)), ...all.filter(inStock), ...all];

  const picked: Listing[] = [];
  const perfumes = new Set<number>();
  for (const listing of candidates) {
    if (perfumes.has(listing.product.id)) continue;
    perfumes.add(listing.product.id);
    picked.push(listing);
    if (picked.length === max) break;
  }
  return picked;
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
