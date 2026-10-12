import type { Metadata } from 'next';
import { site } from './site';

/**
 * Link-preview details for a page. A page that sets `openGraph` replaces the
 * site defaults rather than adding to them, so every page builds its own from
 * here and keeps the site name, locale and share image.
 * Pass `image: false` where the route has its own opengraph-image file.
 */
export function shareMeta(path: string, { title, image = true }: { title?: string; image?: boolean } = {}): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: path,
    ...(title ? { title } : {}),
    ...(image ? { images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }] } : {}),
  };
}
