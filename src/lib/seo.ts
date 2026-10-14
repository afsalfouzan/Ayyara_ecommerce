import type { Metadata } from 'next';
import { site } from './site';

/** Search results show about 60 characters of a title and 155 of a description. */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Shortens text to `max` characters at a word break, adding an ellipsis when it cuts. */
export function clip(text: string, max: number) {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,.;:–-]+$/, '')}…`;
}

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

/**
 * X (Twitter) card for a page. Pages that set their own Open Graph replace the
 * site's twitter defaults too, so they pass the same title, description and
 * image here. `image` is an absolute path on this site.
 */
export function twitterMeta({ title, description, image = '/opengraph-image' }: { title?: string; description?: string; image?: string } = {}): NonNullable<Metadata['twitter']> {
  return {
    card: 'summary_large_image',
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    images: [image],
  };
}
