import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import atelier from '@/assets/shop/distillation.jpg';
import { ContactForm } from '@/components/contact/ContactForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon, type IconName } from '@/components/ui/icons';
import { site } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

/*
 * Contact page in the "L'Élixir Noir" style: the ways to reach the shop, a
 * message form that emails the shop's inbox, and a few common questions.
 * The design was drawn for a phone; from the `lg` breakpoint the contact
 * details sit beside the form.
 */
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Ayyara Rebirth client care for help with fragrances and orders.',
  alternates: { canonical: '/contact' },
  openGraph: shareMeta('/contact'),
};

const channelCard = 'flex items-center gap-4 rounded-sm bg-[#1c1b1b] p-4';
const channelIcon = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#2a2a2a] text-[#cec5b9]';
const channelLabel = 'text-[11px] font-semibold tracking-widest text-[#c4c7c4] uppercase';
const action = 'flex shrink-0 items-center gap-1.5 text-[11px] font-semibold tracking-widest text-[#cec5b9] uppercase transition-colors hover:text-white';

export default function ContactPage() {
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, '')}`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.contact.address}`)}`;
  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question: 'How do I sample a fragrance before committing?',
      answer: 'Each full-size flacon arrives with a complimentary 2ml discovery vial of the same perfume. Try the vial first; if it does not suit you, return the unopened full-size flacon for an exchange or refund.',
    },
    {
      question: 'How long does delivery take?',
      answer: `Orders are packed and dispatched within ${site.policies.dispatchWindow} from our atelier in Kerala and delivered in ${site.policies.deliveryWindow}. You receive the courier’s tracking number by email when your parcel leaves.`,
    },
    {
      question: 'Can I return a perfume?',
      answer: (
        <>
          Unopened products can be returned within {site.policies.returnWindowDays} days of delivery.{' '}
          <Link href="/shipping-returns" className="text-white underline underline-offset-4">
            Read the full policy
          </Link>
          .
        </>
      ),
    },
  ];
  const channels: { icon: IconName; label: string; value: string; href?: string; cta?: string; long?: boolean }[] = [
    { icon: 'phone', label: 'Phone', value: site.contact.phone, href: phoneHref, cta: 'Call' },
    // The address is long: on a phone it gets the row to itself (it is a link anyway) so it stays on one line.
    { icon: 'mail', label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}`, cta: 'Write', long: true },
    { icon: 'clock', label: 'Hours', value: site.contact.hours },
  ];

  return (
    <div className="bg-[#131313] px-5 pt-4 pb-16 text-[#e5e2e1] sm:px-8 sm:pt-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Contact us', href: '/contact' },
          ]}
        />

        <header className="mt-4 flex max-w-xl flex-col gap-2">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-[#cec5b9] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cec5b9]" />
            Client Care
          </p>
          <h1 className="font-playfair text-4xl leading-[44px] tracking-tight text-white md:text-[56px] md:leading-[64px]">Contact us</h1>
          <p className="text-[15px] leading-6 text-[#c4c7c4] md:text-lg md:leading-7 md:font-light">For help choosing a fragrance or with an existing order, our team is happy to assist. Please include your order number if your message is about an order.</p>
        </header>

        <div className="mt-5 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-sm bg-[#1c1b1b] px-4 py-2.5">
              <p className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-[#e5e2e1] uppercase">
                <Icon name="badgeCheck" className="h-[18px] w-[18px] text-[#cec5b9]" />
                Client Care Desk
              </p>
              <p className="text-[13px] text-[#c4c7c4]">We reply within one working day</p>
            </div>

            {channels.map((channel) => (
              <div key={channel.label} className={channelCard}>
                <span className={channelIcon}>
                  <Icon name={channel.icon} strokeWidth={1.8} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={channelLabel}>{channel.label}</p>
                  {channel.href ? (
                    <a href={channel.href} className={`mt-0.5 block leading-6 font-medium break-all text-white transition-colors hover:text-[#cec5b9] ${channel.long ? 'text-[13px] sm:text-[15px]' : 'text-[15px]'}`}>
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[15px] leading-6 font-medium text-white">{channel.value}</p>
                  )}
                </div>
                {channel.href && (
                  <a href={channel.href} className={`${action} ${channel.long ? 'max-sm:hidden' : ''}`} aria-hidden tabIndex={-1}>
                    {channel.cta}
                    <Icon name="arrowRight" strokeWidth={2} className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-3 rounded-sm bg-[#1c1b1b] p-4">
              <div className="flex items-start gap-4">
                <span className={channelIcon}>
                  <Icon name="location" strokeWidth={1.8} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={channelLabel}>Address</p>
                  <address className="mt-0.5 text-[15px] leading-6 font-medium text-white not-italic">{site.contact.address}</address>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#c4c7c4]">Boutique &amp; Laboratory Atelier</span>
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className={action}>
                  Get Directions
                  <Icon name="arrowRight" strokeWidth={2} className="h-4 w-4 -rotate-45" />
                </a>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
              {/* A wide crop of a square photo, drawn at the box's full width. */}
              <Image src={atelier} alt="A copper still among glass bottles, spices and dried flowers by a window" fill sizes="(min-width: 1024px) 50vw, 100vw" quality={85} placeholder="blur" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
              <span className="absolute top-3 right-3 rounded-sm bg-[#0e0e0e]/80 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#e5e2e1] uppercase backdrop-blur-md">Artisanal Alchemy</span>
              <div className="absolute right-4 bottom-4 left-4">
                <p className="text-[11px] font-semibold tracking-[0.25em] text-[#cec5b9] uppercase">The Kerala Atelier</p>
                <p className="font-playfair text-[22px] leading-[30px] font-medium text-white">Veliyamthode, Malappuram</p>
                <p className="mt-1 max-w-sm text-[13px] leading-5 text-[#c4c7c4]">Where rare raw vetiver, forest spices, and pure extracts mature through slow artisanal maceration.</p>
              </div>
            </div>
          </div>

          <section aria-labelledby="message-heading" className="relative overflow-hidden rounded-sm bg-[#1c1b1b] p-4 sm:p-6 lg:p-8">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#cec5b9] uppercase">Direct Dispatch</p>
            <h2 id="message-heading" className="font-playfair text-[28px] leading-9 text-white">
              Send a Message
            </h2>
            <p className="mt-1 mb-5 text-[13px] leading-5 text-[#c4c7c4]">We read every message and reply by email within one working day.</p>
            <ContactForm />
          </section>
        </div>

        <section aria-labelledby="faq-heading" className="mt-10 max-w-3xl md:mt-14">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#cec5b9] uppercase">Curated Queries</p>
          <h2 id="faq-heading" className="font-playfair text-[28px] leading-9 text-white">
            Frequently Asked
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group overflow-hidden rounded-sm bg-[#1c1b1b]">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 text-left text-[15px] leading-6 font-medium text-white">
                  {faq.question}
                  <Icon name="chevronDown" strokeWidth={2} className="h-5 w-5 shrink-0 text-[#c4c7c4] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-[13px] leading-relaxed text-[#c4c7c4]">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
