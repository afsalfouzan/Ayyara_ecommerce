import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts, listingsOf } from '@/lib/catalog';
import { showDrafts } from '@/lib/drafts';
import { profileOf } from '@/lib/fragrance';
import type { Product, Season } from '@/lib/types';

/**
 * Perfumes from the catalogue to feature in an article, chosen by their own
 * data (the seasons set in the admin, or who they're made for), so an article
 * never claims a perfume suits something the shop hasn't said it does.
 */
export async function ProductPicks({ season, gender }: { season?: Season; gender?: Product['gender'] }) {
  const products = (await getProducts()).filter((product) => (!season || profileOf(product).seasons.includes(season)) && (!gender || product.gender === gender));
  if (products.length === 0) {
    return (
      <>
        {showDrafts && (
          <p className="border border-dashed border-gold p-3 text-sm">
            <strong>Draft note:</strong> no perfume is marked {season ? `for ${season}` : `as ${gender}`} in the admin yet, so none can be featured here.
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
