import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { GrievanceOfficer, POLICIES_UPDATED, SellerDetails } from '@/components/content/SellerDetails';
import { site } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What personal information Ayyara Rebirth collects, why, who it is shared with, how long it is kept, and how to see, correct or delete it.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: shareMeta('/privacy-policy'),
};

/*
 * Written to match what the site actually does. If the site starts collecting
 * something new (for example an advertising pixel or analytics), update this
 * page before it goes live.
 */
export default function PrivacyPolicyPage() {
  return (
    <ContentPage title="Privacy policy" path="/privacy-policy" intro={`Last updated ${POLICIES_UPDATED}.`}>
      <p>
        This policy explains what personal information {site.name} collects when you use this website or buy from us, why we collect it, who we share it with, and the choices you have. We collect only what we need to sell and deliver your order, and we never sell your information.
      </p>

      <h2>Who we are</h2>
      <SellerDetails />

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>When you order:</strong> your name, email address, mobile number, delivery address and any delivery notes, the perfumes you bought and what you paid.
        </li>
        <li>
          <strong>When you pay:</strong> payments are handled by Razorpay. We receive the payment reference, the method used (for example UPI or card) and whether the payment succeeded. Your card, UPI and bank details go to Razorpay, never to us.
        </li>
        <li>
          <strong>When you send us a message:</strong> your name, email address, phone number if you give it, and your message. Messages from the contact form are emailed to us and are not stored on the website.
        </li>
        <li>
          <strong>When you sign up for updates:</strong> your email address.
        </li>
        <li>
          <strong>When you browse:</strong> our servers keep basic technical records, such as your IP address, browser type and the pages requested, to keep the site secure and working. Your shopping bag is saved in your own browser (local storage) so it is still there when you come back. We do not use advertising or analytics cookies.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To process, pack and deliver your order, and to send your order confirmation, invoice and delivery updates by email. We may also phone you or message you on WhatsApp about your order.</li>
        <li>To handle returns, refunds and your questions.</li>
        <li>To keep the business and accounting records the law requires.</li>
        <li>To send you news and offers, only if you signed up for them.</li>
        <li>To protect the site and our customers against fraud and misuse.</li>
      </ul>
      <p>By placing an order or sending us your details, you agree to us using them for these purposes.</p>

      <h2>Who we share it with</h2>
      <p>We share only what each one needs to do its job for us:</p>
      <ul>
        <li>
          <strong>Razorpay</strong> processes your payment.
        </li>
        <li>
          <strong>Our courier</strong> receives your name, phone number and delivery address to deliver your parcel.
        </li>
        <li>
          <strong>Resend</strong> sends our emails to you, such as order confirmations.
        </li>
        <li>
          <strong>Our hosting providers</strong> run the website and store its data on secure servers.
        </li>
      </ul>
      <p>We may also disclose information when the law requires it, for example to a court or a government authority.</p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Order, invoice and payment records: as long as Indian law requires us to keep business and accounting records.</li>
        <li>Your email address for updates: until you ask us to remove it.</li>
        <li>Technical records: for a short time, and only as long as needed for security.</li>
      </ul>

      <h2>How we protect it</h2>
      <p>
        The website uses an encrypted connection (HTTPS). Only our own staff can see customer details, each through a personal account, and only as their work requires. Card, UPI and bank details never reach us.
      </p>

      <h2>Your rights</h2>
      <p>Under India’s Digital Personal Data Protection Act, 2023, you can ask us to:</p>
      <ul>
        <li>tell you what personal information we hold about you;</li>
        <li>correct or update it;</li>
        <li>delete it, except records we must keep by law (such as invoices);</li>
        <li>stop sending you updates, at any time.</li>
      </ul>
      <p>
        Email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> from the address you used with us, and we will reply within one month.
      </p>

      <h2>Children</h2>
      <p>This website is meant for adults. Please do not order or send us personal information if you are under 18.</p>

      <h2>Changes to this policy</h2>
      <p>If we change how we use your information, we will update this page and the date at the top.</p>

      <h2>Complaints and grievance officer</h2>
      <GrievanceOfficer />
      <p>
        See also our <Link href="/terms">terms of service</Link> and <Link href="/shipping-returns">delivery and returns policy</Link>.
      </p>
    </ContentPage>
  );
}
