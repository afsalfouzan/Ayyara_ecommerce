import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { GrievanceOfficer, POLICIES_UPDATED } from '@/components/content/SellerDetails';
import { site } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Delivery & Returns',
  description: 'Where we deliver, delivery times, dispatch and the return policy for Ayyara Rebirth orders.',
  alternates: { canonical: '/shipping-returns' },
  openGraph: shareMeta('/shipping-returns'),
};

export default function ShippingReturnsPage() {
  const { dispatchWindow, deliveryArea, deliveryTime, returnWindowDays } = site.policies;
  return (
    <ContentPage eyebrow="Help" title="Delivery & returns" path="/shipping-returns" intro={`Last updated ${POLICIES_UPDATED}.`}>
      <h2>Where we deliver</h2>
      <p>
        We currently deliver only to addresses within {deliveryArea}. Checkout accepts {deliveryArea} addresses only.
      </p>

      <h2>Delivery cost and time</h2>
      <p>
        Delivery is free. Orders are carefully packed and dispatched within {dispatchWindow} of payment, and usually arrive in {deliveryTime}. When your parcel leaves, we email you the courier’s name and tracking number.
      </p>

      <h2>Returns</h2>
      <p>
        If you are not completely satisfied, unopened and unused products in their original packaging may be returned within {returnWindowDays} days of delivery. Please <Link href="/contact">contact us</Link> first with your order number, and we will tell you how to send it back. For hygiene reasons, opened fragrances cannot be returned unless they arrived damaged or faulty.
      </p>

      <h2>Damaged or incorrect items</h2>
      <p>
        If your order arrives damaged or incorrect, please <Link href="/contact">contact us</Link> within 48 hours of delivery with your order number and photographs, and we will make it right.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we receive and check a returned product, we refund it to the original payment method. Your bank may take several business days to show the amount after the refund is processed.
      </p>

      <h2>Complaints</h2>
      <GrievanceOfficer />
    </ContentPage>
  );
}
