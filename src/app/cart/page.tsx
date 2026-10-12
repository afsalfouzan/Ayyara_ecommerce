import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Your Bag',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <Container className="pt-10 pb-24 sm:pt-14">
      <p className="eyebrow">Atelier Selection</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-light tracking-wide text-white">Your Shopping Bag</h1>
      <CartView />
    </Container>
  );
}
