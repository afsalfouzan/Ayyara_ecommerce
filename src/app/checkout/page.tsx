import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Container className="pt-10 pb-24 sm:pt-14">
      <p className="eyebrow">Guest checkout</p>
      <h1 className="mt-3 text-5xl">Checkout</h1>
      <CheckoutForm />
    </Container>
  );
}
