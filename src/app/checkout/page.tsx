import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Container className="pt-6 pb-16 sm:pt-10 md:pb-24">
      <p className="eyebrow">Secure checkout</p>
      <h1 className="heading mt-2 text-fg">Checkout</h1>
      <CheckoutForm />
    </Container>
  );
}
