import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Icon, type IconName } from '@/components/ui/icons';
import { site } from '@/lib/site';
import { faqJsonLd } from '@/lib/structured-data';
import { shareMeta } from '@/lib/seo';

/*
 * Contact page: the ways to reach the shop, a message form that emails the
 * shop's inbox, and a few common questions.
 */
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Ayyara Rebirth client care for help with fragrances and orders.',
  alternates: { canonical: '/contact' },
  openGraph: shareMeta('/contact'),
};

export default function ContactPage() {
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, '')}`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.contact.address}`)}`;
  // Each answer is plain text, so the structured data below carries exactly the words on the page.
  const faqs: { question: string; answer: string; link?: { href: string; label: string } }[] = [
    {
      question: 'How do I track my order?',
      answer: 'When your parcel leaves, we email you the courier’s name and tracking number. The link in your order confirmation email also shows the latest status.',
    },
    {
      question: 'How long does delivery take?',
      answer: `Orders are packed and dispatched within ${site.policies.dispatchWindow} from our atelier in Kerala and delivered in ${site.policies.deliveryWindow}. You receive the courier’s tracking number by email when your parcel leaves.`,
    },
    {
      question: 'Can I return a perfume?',
      answer: `Unopened products can be returned within ${site.policies.returnWindowDays} days of delivery.`,
      link: { href: '/shipping-returns', label: 'Read the full policy' },
    },
  ];
  const channels: { icon: IconName; label: string; value: string; href?: string }[] = [
    { icon: 'phone', label: 'Phone', value: site.contact.phone, href: phoneHref },
    { icon: 'mail', label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: 'clock', label: 'Hours', value: site.contact.hours },
  ];

  return (
    <Container className="pt-5 pb-16 sm:pt-8 md:pb-24">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Contact us', href: '/contact' },
        ]}
      />

      <header className="mt-6 max-w-2xl md:mt-8">
        <p className="eyebrow">Client care</p>
        <h1 className="mt-2 text-4xl text-fg md:text-6xl">Contact us</h1>
        <p className="mt-3 text-base leading-relaxed text-fg-soft">For help choosing a fragrance or with an existing order, our team is happy to assist. Please include your order number if your message is about an order.</p>
      </header>

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <dl className="divide-y divide-line border-y border-line">
            {channels.map((channel) => (
              <div key={channel.label} className="flex items-start gap-4 py-5">
                <Icon name={channel.icon} strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-fg" />
                <div className="min-w-0">
                  <dt className="text-xs font-medium tracking-[0.12em] text-mute uppercase">{channel.label}</dt>
                  <dd className="mt-1 text-[15px] text-fg">
                    {channel.href ? (
                      <a href={channel.href} className="break-all underline-offset-4 hover:underline">
                        {channel.value}
                      </a>
                    ) : (
                      channel.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4 py-5">
              <Icon name="location" strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-fg" />
              <div className="min-w-0">
                <dt className="text-xs font-medium tracking-[0.12em] text-mute uppercase">Address</dt>
                <dd className="mt-1 text-[15px] text-fg">
                  <address className="not-italic">{site.contact.address}</address>
                  <a href={mapHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-medium tracking-[0.12em] uppercase underline underline-offset-4 hover:text-gold">
                    Get directions
                  </a>
                </dd>
              </div>
            </div>
          </dl>
          <p className="mt-4 text-sm text-mute">We reply within one working day.</p>
        </div>

        <section aria-labelledby="message-heading" className="bg-surface p-5 sm:p-8">
          <h2 id="message-heading" className="font-display text-2xl text-fg md:text-3xl">
            Send a message
          </h2>
          <p className="mt-1 mb-6 text-sm text-fg-soft">We read every message and reply by email within one working day.</p>
          <ContactForm />
        </section>
      </div>

      <section aria-labelledby="faq-heading" className="mt-14 max-w-3xl md:mt-20">
        <h2 id="faq-heading" className="font-display text-3xl text-fg md:text-4xl">
          Common questions
        </h2>
        <div className="mt-4 border-t border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-line">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-medium text-fg">
                {faq.question}
                <Icon name="chevronDown" strokeWidth={1.8} className="h-4 w-4 shrink-0 text-mute transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="pb-5 text-sm leading-relaxed text-fg-soft">
                {faq.answer}
                {faq.link && (
                  <>
                    {' '}
                    <Link href={faq.link.href} className="text-fg underline underline-offset-4">
                      {faq.link.label}
                    </Link>
                    .
                  </>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
      <JsonLd data={faqJsonLd(faqs)} />
    </Container>
  );
}
