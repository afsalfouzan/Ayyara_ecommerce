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
      <h1 className="text-5xl">Your bag</h1>
      <CartView />
    </Container>
  );
}
