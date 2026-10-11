import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Delivery & Returns',
  description: 'Delivery times, dispatch and return policy for Ayyara Rebirth orders across India.',
  alternates: { canonical: '/shipping-returns' },
};

export default function ShippingReturnsPage() {
  const { dispatchWindow, deliveryWindow, returnWindowDays } = site.policies;
  return (
    <ContentPage eyebrow="Help" title="Delivery & returns" path="/shipping-returns" draft>
      <h2>Delivery</h2>
      <p>
        Orders are carefully packed and dispatched within {dispatchWindow} of payment confirmation, and
        typically arrive in {deliveryWindow}. You will receive tracking details by email once your order
        has been dispatched.
      </p>
      <h2>Returns</h2>
      <p>
        If you are not completely satisfied, unopened and unused products in their original packaging may
        be returned within {returnWindowDays} days of delivery. For hygiene reasons, opened fragrances
        cannot be returned unless they arrived damaged or faulty.
      </p>
      <h2>Damaged or incorrect items</h2>
      <p>
        If your order arrives damaged or incorrect, please <Link href="/contact">contact us</Link> within
        48 hours of delivery with your order number and photographs, and we will make it right.
      </p>
      <h2>Refunds</h2>
      <p>
        Approved refunds are issued to the original payment method. Your bank may take several business
        days to reflect the amount after the refund is processed.
      </p>
    </ContentPage>
  );
}
