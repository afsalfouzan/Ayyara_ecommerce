import type { MetadataRoute } from 'next';
import { authors } from '@/content/authors';
import { categories, posts } from '@/content/journal/posts';
import { getProducts } from '@/lib/catalog';
import { absoluteUrl, collections } from '@/lib/site';

/**
 * When the wording of the brand and policy pages last changed. Bump it when
 * one of them is edited, so search engines know to read them again.
 */
const CONTENT_UPDATED = '2026-10-14';

const contentPages = ['/our-story', '/faq', '/contact', '/shipping-returns', '/privacy-policy', '/terms'];

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
    ...journalEntries(),
  ];
}

/** Published articles, and the journal, category and author pages that have any. Drafts are never listed. */
function journalEntries(): MetadataRoute.Sitemap {
  const published = posts.filter((post) => !post.draft);
  if (published.length === 0) return [];
  const latest = (list: typeof published) => list.reduce((date, post) => (post.updated > date ? post.updated : date), '');
  const withPosts = categories.filter((category) => published.some((post) => post.category === category.slug));
  const people = authors.filter((author) => !author.draft && published.some((post) => post.author === author.slug));
  return [
    { url: absoluteUrl('/journal'), lastModified: latest(published), changeFrequency: 'weekly', priority: 0.6 },
    ...published.map((post) => ({ url: absoluteUrl(`/journal/${post.slug}`), lastModified: post.updated, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...withPosts.map((category) => ({ url: absoluteUrl(`/journal/category/${category.slug}`), lastModified: latest(published.filter((post) => post.category === category.slug)), changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...people.map((author) => ({ url: absoluteUrl(`/journal/authors/${author.slug}`), changeFrequency: 'yearly' as const, priority: 0.3 })),
  ];
}
