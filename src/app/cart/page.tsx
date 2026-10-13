import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { getProducts } from '@/lib/catalog';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Your Bag',
  robots: { index: false, follow: true },
};

/** The bag lives in the browser, so the page itself only supplies the catalogue (for notes and suggestions). */
export default async function CartPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    // The bag still works without the catalogue: it just shows no notes and no suggestions.
  }
  return (
    <div className="bg-[#131313] px-5 pt-6 pb-16 text-[#e5e2e1] sm:px-8 sm:pt-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <CartView products={products} />
      </div>
    </div>
  );
}
