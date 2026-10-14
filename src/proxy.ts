import { NextResponse, type NextRequest } from 'next/server';
import { API_URL } from '@/lib/api';
import { collections } from '@/lib/site';

/*
 * Real 404s for product and collection addresses that don't exist.
 *
 * Those pages are served from a prerendered shell that starts streaming before
 * the page knows whether the perfume exists, which fixes the status at 200
 * (with a noindex tag). Search engines prefer a plain 404, so the address is
 * checked here first, as the Next.js docs suggest, against a list of product
 * slugs kept in memory. Anything unknown is rewritten to an address with no
 * page, which renders the shop's not-found page with a 404 status.
 *
 * The check fails open: if the product list can't be fetched, the request goes
 * through and the page handles it as before.
 */

const COLLECTIONS = new Set<string>(collections.map((collection) => collection.slug));

/** How long the slug list is trusted, and how soon an unknown slug may trigger a refresh (a perfume just added). */
const FRESH_FOR_MS = 5 * 60_000;
const RECHECK_AFTER_MS = 30_000;

let slugs: Set<string> | null = null;
let fetchedAt = 0;
let pending: Promise<void> | null = null;

function refresh() {
  pending ??= fetch(`${API_URL}/store/products`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) })
    .then(async (response) => {
      if (!response.ok) return;
      const { items } = (await response.json()) as { items: { slug: string }[] };
      slugs = new Set(items.map((item) => item.slug));
      fetchedAt = Date.now();
    })
    .catch(() => undefined)
    .finally(() => {
      pending = null;
    });
  return pending;
}

/** True or false when known, null when the list can't be had. */
async function productExists(slug: string) {
  const age = Date.now() - fetchedAt;
  if (!slugs || age > FRESH_FOR_MS || (!slugs.has(slug) && age > RECHECK_AFTER_MS)) await refresh();
  return slugs ? slugs.has(slug) : null;
}

function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL('/__not-found', request.url));
}

export async function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split('/');
  if (!slug) return NextResponse.next();
  if (section === 'shop' && !COLLECTIONS.has(slug)) return notFound(request);
  if (section === 'products' && (await productExists(decodeURIComponent(slug))) === false) return notFound(request);
  return NextResponse.next();
}

export const config = {
  // Only the page itself; its share image (/products/x/opengraph-image) is a separate address and not matched.
  matcher: ['/products/:slug', '/shop/:collection'],
};
