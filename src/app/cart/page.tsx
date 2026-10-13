import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { Container } from '@/components/ui/Container';
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
    <Container className="pt-6 pb-16 sm:pt-10 md:pb-24">
      <CartView products={products} />
    </Container>
  );
}
