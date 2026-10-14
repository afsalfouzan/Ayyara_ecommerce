import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { GrievanceOfficer, POLICIES_UPDATED, SellerDetails } from '@/components/content/SellerDetails';
import { site } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for buying from Ayyara Rebirth online: who sells, orders, prices, payment, delivery within Kerala, returns, and how to raise a complaint.',
  alternates: { canonical: '/terms' },
  openGraph: shareMeta('/terms'),
};

export default function TermsPage() {
  const { policies } = site;
  return (
    <ContentPage title="Terms of service" path="/terms" intro={`Last updated ${POLICIES_UPDATED}.`}>
      <p>These terms apply when you buy from the {site.name} website. By placing an order, you agree to them.</p>

      <h2>Who you are buying from</h2>
      <SellerDetails />

      <h2>Our products</h2>
      <p>
        We describe each perfume, its size and its price as accurately as we can. Colours in photographs can look slightly different on different screens, and fragrance is personal, so the same perfume can smell a little different on different people.
      </p>

      <h2>Who can order</h2>
      <p>You must be 18 or older to order, and you must give a correct name, email address, mobile number and delivery address.</p>

      <h2>Orders</h2>
      <p>
        Your order is confirmed only when your payment has been received, and we send a confirmation email with your invoice. We may cancel an order and refund it in full if a perfume becomes unavailable, if there is an obvious error in its price or description, or if we cannot deliver to the address given.
      </p>

      <h2>Prices and payment</h2>
      <p>
        Prices are in Indian rupees and include all taxes. Delivery is free. You pay the price shown at checkout. Payment is made online through Razorpay, by UPI, card or net banking.
      </p>

      <h2>Delivery</h2>
      <p>
        We currently deliver only to addresses within {policies.deliveryArea}. Orders are dispatched within {policies.dispatchWindow} and usually arrive in {policies.deliveryTime}. Full details are in our <Link href="/shipping-returns">delivery and returns policy</Link>.
      </p>

      <h2>Cancellations</h2>
      <p>To cancel an order, contact us as soon as possible. If it has not been dispatched, we cancel it and refund you in full.</p>

      <h2>Returns and refunds</h2>
      <p>
        Unopened and unused perfumes in their original packaging can be returned within {policies.returnWindowDays} days of delivery. Refunds go back to the original payment method. See our <Link href="/shipping-returns">delivery and returns policy</Link>.
      </p>

      <h2>Our name and content</h2>
      <p>The {site.name} name, logo, photographs and text on this website belong to {site.name}. Please do not copy or use them without our written permission.</p>

      <h2>Our responsibility</h2>
      <p>
        Please read the notes and ingredients of a perfume before you use it, and stop using it if it irritates your skin. Nothing in these terms limits your rights under the Consumer Protection Act, 2019.
      </p>

      <h2>Law and disputes</h2>
      <p>These terms are governed by the laws of India. Any dispute is subject to the courts of Malappuram, Kerala.</p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms. The version on this page when you place an order is the one that applies to it.</p>

      <h2>Complaints and grievance officer</h2>
      <GrievanceOfficer />
      <p>
        How we handle your information is explained in our <Link href="/privacy-policy">privacy policy</Link>.
      </p>
    </ContentPage>
  );
}
