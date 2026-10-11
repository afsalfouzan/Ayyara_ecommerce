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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products', `product:${slug}`);
  try {
    const { product } = await storeApi<{ product: Product }>(`/store/products/${encodeURIComponent(slug)}`);
    return product;
  } catch (error) {
    if (error instanceof StoreApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.slug !== slug).slice(0, limit);
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

/** Unisex perfumes appear in both the men's and women's collections. */
export function inCollection(product: Product, collection: 'men' | 'women') {
  return product.gender === collection || product.gender === 'unisex';
}

export function isOnOffer(listing: Listing) {
  return listing.variant.mrpPaise > listing.variant.pricePaise;
}

/** Home-page picks: sizes in stock first, keeping catalogue order. */
export function featuredListings(products: Product[], limit = 4) {
  const all = listingsOf(products);
  const inStock = all.filter((l) => l.variant.stockStatus !== 'out_of_stock');
  return [...inStock, ...all.filter((l) => !inStock.includes(l))].slice(0, limit);
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
