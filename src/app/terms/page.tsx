import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { site } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms that apply to purchases from the Ayyara Rebirth online store.',
  alternates: { canonical: '/terms' },
  openGraph: shareMeta('/terms'),
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms of service" path="/terms" draft>
      <p>These terms apply to purchases made on the {site.name} online store. They must be reviewed before launch.</p>
      <h2>Orders</h2>
      <p>
        An order is confirmed only after payment has been verified. We may cancel and fully refund an order
        if an item becomes unavailable or a pricing error occurs.
      </p>
      <h2>Pricing</h2>
      <p>All prices are shown in Indian Rupees (INR). The price charged is the price shown at checkout.</p>
      <h2>Delivery and returns</h2>
      <p>Please see our Delivery &amp; Returns policy.</p>
    </ContentPage>
  );
}
