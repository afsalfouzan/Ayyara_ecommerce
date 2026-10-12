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
      <p className="eyebrow">Secure Checkout</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-light tracking-wide text-white">Order Checkout</h1>
      <CheckoutForm />
    </Container>
  );
}
