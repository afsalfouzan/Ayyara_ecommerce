import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts, listingsOf } from '@/lib/catalog';
import { showDrafts } from '@/lib/drafts';
import type { Product } from '@/lib/types';

/**
 * Perfumes from the catalogue to feature in an article: all of them, or those
 * made for one gender, so an article never claims more than the shop has said.
 */
export async function ProductPicks({ gender }: { gender?: Product['gender'] }) {
  const products = (await getProducts()).filter((product) => !gender || product.gender === gender);
  if (products.length === 0) {
    return (
      <>
        {showDrafts && (
          <p className="border border-dashed border-gold p-3 text-sm">
            <strong>Draft note:</strong> no perfume is marked as {gender} in the admin yet, so none can be featured here.
          </p>
        )}
        <p>
          <Link href="/shop">Browse the whole collection</Link> to find yours.
        </p>
      </>
    );
  }
  return (
    <ul className="not-prose mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
      {listingsOf(products)
        .slice(0, 6)
        .map((listing) => (
          <li key={listing.variant.id}>
            <ProductCard listing={listing} />
          </li>
        ))}
    </ul>
  );
}
