import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/catalog';
import { absoluteUrl, collections } from '@/lib/site';

/**
 * When the wording of the brand and policy pages last changed. Bump it when
 * one of them is edited, so search engines know to read them again.
 */
const CONTENT_UPDATED = '2026-10-14';

const contentPages = ['/our-story', '/contact', '/shipping-returns', '/privacy-policy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);
  // The shop pages change whenever a perfume does, so they carry the newest product's date.
  const catalogueUpdated = products.reduce<string>((latest, product) => (product.updatedAt > latest ? product.updatedAt : latest), CONTENT_UPDATED);
  const cataloguePages = ['/', '/shop', ...collections.map((collection) => `/shop/${collection.slug}`), '/offers'];

  return [
    ...cataloguePages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: catalogueUpdated,
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.9,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...contentPages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ];
}
