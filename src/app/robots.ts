import type { MetadataRoute } from 'next';
import { absoluteUrl, isLiveSite, site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Staging and preview copies must never compete with the real site in search results.
  if (!isLiveSite) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Transactional pages carry no search value; they are also noindex.
        disallow: ['/cart', '/checkout', '/order/', '/invoice/', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
