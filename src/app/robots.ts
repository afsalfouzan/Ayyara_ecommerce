import type { MetadataRoute } from 'next';
import { absoluteUrl, site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Transactional pages carry no search value; they are also noindex.
        disallow: ['/cart', '/checkout', '/order/', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
