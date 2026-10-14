import type { Metadata } from 'next';
import Link from 'next/link';
import { DraftBanner } from '@/components/journal/JournalParts';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { liveLink, visibleFaqGroups } from '@/content/faq';
import { shareMeta } from '@/lib/seo';
import { faqJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers about delivery times and cost, returns and refunds, authenticity, storing perfume, choosing a fragrance and paying at Ayyara Rebirth.',
  alternates: { canonical: '/faq' },
  openGraph: shareMeta('/faq', { title: 'FAQ | Ayyara Rebirth' }),
};

/** Every common question in one place, grouped, each with a short direct answer. The site's only FAQPage data. */
export default function FaqPage() {
  const groups = visibleFaqGroups();
  const published = groups.flatMap((group) => group.items).filter((faq) => !faq.draft);
  return (
    <Container size="narrow" className="pt-5 pb-16 sm:pt-8 md:pb-24">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'FAQ', href: '/faq' }]} />
      <header className="mt-6 md:mt-8">
        <p className="eyebrow">Help</p>
        <h1 className="mt-2 text-4xl text-fg md:text-6xl">Frequently asked questions</h1>
        <p className="mt-3 text-base leading-relaxed text-fg-soft">
          Can’t find your answer? <Link href="/contact" className="text-fg underline underline-offset-4">Contact us</Link> and we will reply within one working day.
        </p>
      </header>
      <nav aria-label="Topics" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-4">
        {groups.map((group) => (
          <a key={group.title} href={`#${group.title.toLowerCase().replace(/\W+/g, '-')}`} className="text-xs font-medium tracking-[0.12em] text-mute uppercase hover:text-fg">
            {group.title}
          </a>
        ))}
      </nav>
      {groups.map((group) => (
        <section key={group.title} id={group.title.toLowerCase().replace(/\W+/g, '-')} aria-labelledby={`${group.title}-heading`} className="mt-12 scroll-mt-24">
          <h2 id={`${group.title}-heading`} className="font-display text-3xl text-fg">
            {group.title}
          </h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {group.items.map((faq) => {
              const link = liveLink(faq);
              return (
                <div key={faq.id} className="py-5">
                  <h3 className="text-base font-medium text-fg">
                    {faq.question}
                    {faq.draft && <span className="ml-2 text-xs text-gold">DRAFT</span>}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-fg-soft">
                    {faq.answer}
                    {link && (
                      <>
                        {' '}
                        <Link href={link.href} className="text-fg underline underline-offset-4">
                          {link.label}
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {groups.some((group) => group.items.some((faq) => faq.draft)) && (
        <div className="mt-10">
          <DraftBanner what="page’s questions marked DRAFT" />
        </div>
      )}
      {/* Only approved answers go into the structured data. */}
      <JsonLd data={faqJsonLd(published.map((faq) => ({ question: faq.question, answer: faq.answer })))} />
    </Container>
  );
}
