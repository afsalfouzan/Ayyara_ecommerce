/*
 * Writes MISSING_PRODUCT_DATA.md: for each perfume on the website, the
 * fragrance-profile details not yet filled in the admin, so they can be asked
 * of the client. Reads the public store API, so it lists only perfumes shown
 * on the website (hidden ones are left out).
 *
 *   npm run report:missing-data                                        (local backend)
 *   API_URL=https://api.staging.example/api/v1 npm run report:missing-data
 *
 * Uses the same check as the product page (src/lib/fragrance.ts); Node runs
 * that TypeScript file directly.
 */
import { writeFile } from 'node:fs/promises';
import { missingFields } from '../src/lib/fragrance.ts';

const api = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');
const response = await fetch(`${api}/store/products`);
if (!response.ok) throw new Error(`The store API answered ${response.status} at ${api}`);
const { items } = await response.json();

const today = new Date().toISOString().slice(0, 10);
const lines = [
  '# Missing product data',
  '',
  `Generated ${today} from \`${api}\` with \`npm run report:missing-data\`. Rerun it after filling in details.`,
  '',
  'Each perfume below is on the website but is missing fragrance-profile details. The website shows only what is filled in and never guesses, so the product page, its questions and its search data stay incomplete until these are supplied.',
  '',
  '**Where to fill them in:** Admin → Stock → the perfume → Edit → *Fragrance profile*.',
  '',
  '**What to ask the client for:** facts they or the perfumer can stand behind. Longevity is in hours on skin. For projection, use soft, moderate or strong. Seasons are summer, monsoon or winter. Allergens should be as printed on the box. For a similar scent profile, describe the style rather than naming other brands.',
  '',
];
const incomplete = items.map((product) => ({ product, missing: missingFields(product) })).filter(({ missing }) => missing.length > 0);
if (incomplete.length === 0) lines.push('Every perfume on the website has a complete profile.');
for (const { product, missing } of incomplete) {
  lines.push(`## ${product.name}`, '', `Page: \`/products/${product.slug}\` · ${product.concentration} · ${product.variants.map((v) => `${v.sizeMl} ml`).join(', ')}`, '');
  for (const field of missing) lines.push(`- [ ] ${field}`);
  lines.push('');
}
await writeFile(new URL('../MISSING_PRODUCT_DATA.md', import.meta.url), lines.join('\n'));
console.log(`MISSING_PRODUCT_DATA.md: ${incomplete.length} of ${items.length} perfumes need details.`);
