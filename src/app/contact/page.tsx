import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContentPage } from '@/components/content/ContentPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Ayyara Rebirth client care for help with fragrances and orders.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const rows = [
    { icon: Phone, label: 'Phone', value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Clock, label: 'Hours', value: site.contact.hours },
    { icon: MapPin, label: 'Address', value: site.contact.address },
  ];
  return (
    <ContentPage
      eyebrow="Client care"
      title="Contact us"
      intro="For help choosing a fragrance or with an existing order, our team is happy to assist. Please include your order number if your message is about an order."
      path="/contact"
    >
      <dl className="divide-y divide-line border-y border-line">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-5 py-6">
            <Icon className="mt-0.5 size-5 shrink-0 text-gold-bright" strokeWidth={1} aria-hidden />
            <div>
              <dt className="label text-fg">{label}</dt>
              <dd className="mt-1.5 text-fg-soft">
                {href ? (
                  <a href={href} className="link-underline hover:text-fg">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </ContentPage>
  );
}
