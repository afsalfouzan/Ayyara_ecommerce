import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Ayyara Rebirth collects, uses and protects your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <ContentPage title="Privacy policy" path="/privacy-policy" draft>
      <p>
        This policy explains what personal information {site.name} collects when you place an order and
        how it is used. It must be reviewed against applicable law before launch.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details: name, email address and mobile number.</li>
        <li>Delivery address.</li>
        <li>Order and payment status. Card and bank details are handled by Razorpay and never stored by us.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To process and deliver your order, send order updates, handle returns and refunds, and respond to your enquiries.</p>
      <h2>Access to your information</h2>
      <p>Access is limited to authorised staff who need it to fulfil your order.</p>
      <h2>Contact</h2>
      <p>
        For privacy requests, email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </ContentPage>
  );
}
