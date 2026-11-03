import type { FragranceNotes, Product, ProductExtras } from './types';

/*
 * The extra sections of a perfume's page: "Fragrance Notes", "Who It's For" and "Longevity & Projection".
 * Each one shows only when it has content, so a perfume with nothing here simply has no such section.
 *
 * TODO(owner): fill these in, one entry per perfume, keyed by its slug (the last part of its address, e.g.
 * "ayyara-one"). Write only what the perfumer will stand behind. Shape of an entry:
 *
 *   'ayyara-one': {
 *     fragranceNotes: { top: ['…'], heart: ['…'], base: ['…'] },
 *     whoItsFor: '…',
 *     longevityProjection: '…',
 *   },
 *
 * Anything the API sends for the same fields takes priority over this file.
 */
export const productContent: Record<string, ProductExtras> = {};

const text = (value: string | null | undefined) => value?.trim() || null;
const notes = (value: FragranceNotes | null | undefined) => (value && (value.top.length || value.heart.length || value.base.length) ? value : null);

/** The extra sections that have content for this perfume (null for any that don't). */
export function extrasOf(product: Product) {
  const own = productContent[product.slug] ?? {};
  return {
    fragranceNotes: notes(product.fragranceNotes) ?? notes(own.fragranceNotes),
    whoItsFor: text(product.whoItsFor) ?? text(own.whoItsFor),
    longevityProjection: text(product.longevityProjection) ?? text(own.longevityProjection),
  };
}
