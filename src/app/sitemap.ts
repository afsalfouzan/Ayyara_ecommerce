import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/site';

const staticPages = ['/', '/shop', '/shop/men', '/shop/women', '/offers', '/our-story', '/contact', '/shipping-returns', '/privacy-policy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);
  return [
    ...staticPages.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: path === '/' || path.startsWith('/shop') || path === '/offers' ? ('weekly' as const) : ('yearly' as const),
      priority: path === '/' ? 1 : path.startsWith('/shop') || path === '/offers' ? 0.9 : 0.4,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
