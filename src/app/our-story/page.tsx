import storyChapter1 from '@/assets/story/chapter1.jpg';
import storyChapter2 from '@/assets/story/chapter2.jpg';
import storyHero from '@/assets/story/hero.jpg';
import storyWater from '@/assets/story/water.jpg';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Award, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { DraftBanner } from '@/components/journal/JournalParts';
import { JsonLd } from '@/components/seo/JsonLd';
import { visibleAboutSections } from '@/content/about';
import { visibleAuthors } from '@/content/authors';
import { getProducts } from '@/lib/catalog';
import { collections, site } from '@/lib/site';
import { aboutPageJsonLd } from '@/lib/structured-data';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Our Story | Maison Origin & Manifesto',
  description:
    'Ayyara Rebirth is where the earth’s finest botanicals meet modern alchemy. Discover the philosophy, craftsmanship, and story behind our luxury fragrances.',
  alternates: { canonical: '/our-story' },
  openGraph: shareMeta('/our-story'),
};

/* Full-size originals kept in the project so they are served sharp and correctly sized (concept images; replace with Ayyara's own). */
const IMAGES = { hero: storyHero, chapter1: storyChapter1, water: storyWater, chapter2: storyChapter2 };

export default async function OurStoryPage() {
  // Plain facts for the "at a glance" section, from the catalogue and the shop's settings.
  const products = await getProducts().catch(() => []);
  const concentrations = [...new Set(products.map((product) => product.concentration))];
  const people = visibleAuthors();
  const making = visibleAboutSections();
  return (
    <article className="relative w-full bg-canvas text-fg">
      {/* ── 1. Hero Section ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden border-b border-white/10 sm:min-h-[580px] lg:min-h-[640px]">
        <Image
          src={IMAGES.hero}
          alt="Misty canopy forest landscape in black and white, dramatic atmospheric monochrome foliage, ancient trees reaching through morning haze"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 100vw, 240vw"
          quality={85}
          placeholder="blur"
          className="object-cover object-center opacity-70 transition-transform duration-1000 ease-out hover:scale-105"
        />
        {/* Cinematic dark vignette scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/55" />

        <Container size="narrow" className="relative z-10 mx-auto px-4 py-20 text-center">
          <span className="mb-4 inline-block font-sans text-xs font-semibold tracking-[0.3em] text-[#cec5b9] uppercase sm:text-sm">
            Maison Origin &amp; Manifesto
          </span>
          <h1 className="font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl">
            Rebirth Of The Senses
          </h1>
          <p className="mx-auto mt-6 max-w-lg font-sans text-base font-light leading-relaxed text-stone-300 sm:text-lg">
            Welcome to Ayyara Rebirth, where fine fragrances are born from modern alchemy.
          </p>
        </Container>
      </section>

      {/* ── 2. Editorial Statement ──────────────────────────────────── */}
      <section className="border-b border-line bg-canvas py-16 sm:py-24">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-line" />
          <p className="text-xl font-light leading-relaxed text-fg-soft italic sm:text-2xl sm:leading-loose lg:text-3xl">
            “At Ayyara Rebirth, our formulation is a love letter to the earth’s raw and untamed landscapes. We believe
            the truest modern alchemy is simply allowing nature to speak for itself. We harvest bright, living
            botanicals and ground them in deep, earthy elements, creating a fragrance that breathes and evolves with you
            naturally.”
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-line" />
        </Container>
      </section>

      {/* ── 3. Chapter I · The Dialogue ─────────────────────────────── */}
      <section className="border-b border-line py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-neutral-900 sm:aspect-[16/10]">
            <Image
              src={IMAGES.chapter1}
              alt="Antique typewriter beside a crystalline perfume flacon labeled Ayyara on a weathered studio desk"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              quality={85}
              placeholder="blur"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col justify-center text-center lg:text-left">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-mute uppercase">
              Chapter I · The Dialogue
            </span>
            <h2 className="mt-3 text-3xl text-fg sm:text-4xl">
              An Ode to the Earth’s Elements
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-fg-soft sm:text-lg">
              Born from a deep reverence for nature, Ayyara Rebirth is where the earth’s finest elements meet modern
              alchemy. We look to the natural world not just for our ingredients, but for our inspiration. We source
              from the most vibrant landscapes to create botanical blends that truly awaken the senses.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border-b border-line pb-1 font-sans text-sm font-medium tracking-widest text-mute uppercase transition-colors hover:text-fg"
              >
                Discover the Scent Notes &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. Chapter II · The Resonance ───────────────────────────── */}
      <section className="border-b border-line py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex flex-col justify-center text-center lg:order-1 lg:text-left">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-mute uppercase">
              Chapter II · The Resonance
            </span>
            <h2 className="mt-3 text-3xl text-fg sm:text-4xl">
              Bottling the Essence of Rebirth
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-fg-soft sm:text-lg">
              From our signature fragrances to our expanding collections of holistic beauty, everything we create is
              designed to harmonize with your natural state. We celebrate the pure, the organic, and the pristine,
              bottling the essence of the earth to help you discover your own rebirth.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <ButtonLink href="/shop" variant="outline">
                Explore The Atelier
              </ButtonLink>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-4 lg:order-2">
            {/* Water ripples texture banner */}
            <div className="relative h-32 w-full overflow-hidden rounded-sm border border-line sm:h-36">
              <Image
                src={IMAGES.water}
                alt="Delicate concentric water ripples disturbance, liquid gloss texture"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
              quality={85}
              placeholder="blur"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent" />
            </div>

            {/* Velvet armchair flacon monograph */}
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-line sm:aspect-[16/10]">
              <Image
                src={IMAGES.chapter2}
                alt="Clear glass luxury perfume bottle resting on deep velvet vintage armchair beside art monograph book"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
              quality={85}
              placeholder="blur"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 5. Natural Elegance (Philosophy Callout) ────────────────── */}
      <section className="border-b border-line bg-surface py-16 sm:py-24">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-neutral-900 text-mute">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-mute uppercase">
            Pure Philosophy
          </span>
          <h2 className="mt-2 text-3xl text-fg sm:text-4xl">Natural Elegance</h2>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-fg-soft sm:text-lg sm:leading-loose">
            Born from the earth, Ayyara Rebirth is a return to natural elegance. We see modern alchemy as a collaboration
            with nature distilling sunlit botanicals and deep, grounding woods into living, breathing rituals. By
            stripping away the unnecessary, we let the purest elements speak for themselves. Whether through scent or
            clean beauty, our promise is simply an invitation to reconnect, awaken, and experience your own rebirth.
          </p>
        </Container>
      </section>

      {/* ── 6. Sacred Tenets / Atelier Distinctions ─────────────────── */}
      <section className="border-b border-line py-16 sm:py-24">
        <Container>
          <div className="text-center">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-mute uppercase">
              Our Sacred Tenets
            </span>
            <h2 className="mt-2 text-3xl text-fg sm:text-4xl">Atelier Distinctions</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col items-center rounded-sm border border-line bg-surface p-8 text-center transition-all duration-300 hover:border-line hover:bg-neutral-900">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-mute border border-line">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl text-fg">100% Satisfaction Guarantee</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-mute">
                Your complete satisfaction is at the heart of what we do. We are dedicated to ensuring every Ayyara
                Rebirth experience delights you from the first spray.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center rounded-sm border border-line bg-surface p-8 text-center transition-all duration-300 hover:border-line hover:bg-neutral-900">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-mute border border-line">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl text-fg">Uncompromising Quality</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-mute">
                Formulated with exceptional care, using only the finest premium ingredients to meet the absolute highest
                standards of modern luxury.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center rounded-sm border border-line bg-surface p-8 text-center transition-all duration-300 hover:border-line hover:bg-neutral-900">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-mute border border-line">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-xl text-fg">Swift &amp; Secure Delivery</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-mute">
                Packaged with elegance and handled with the utmost care, ensuring your new signature scent arrives safely
                and promptly to your door.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 7. The people behind the brand (shown once their profiles are approved) ── */}
      {people.length > 0 && (
        <section aria-labelledby="people-heading" className="border-b border-line py-16 sm:py-24">
          <Container size="narrow">
            <h2 id="people-heading" className="text-3xl text-fg sm:text-4xl">
              The people behind Ayyara Rebirth
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {people.map((person) => (
                <li key={person.slug} className="border border-line bg-surface p-6">
                  <p className="eyebrow">{person.role}</p>
                  <h3 className="mt-2 text-xl text-fg">
                    <Link href={`/journal/authors/${person.slug}`} className="underline-offset-4 hover:underline">
                      {person.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-soft">{person.summary}</p>
                  {person.draft && <p className="mt-3 text-xs text-gold">DRAFT: awaiting the client’s details</p>}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── 8. Ingredients and craftsmanship (shown once the client's facts are approved) ── */}
      {making.length > 0 && (
        <section className="border-b border-line py-16 sm:py-24">
          <Container size="narrow" className="space-y-12">
            {making.map((part) => (
              <div key={part.id} aria-labelledby={`${part.id}-heading`}>
                <h2 id={`${part.id}-heading`} className="text-3xl text-fg sm:text-4xl">
                  {part.title}
                </h2>
                <div className="prose-luxe mt-4">
                  {part.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
            {making.some((part) => part.draft) && <DraftBanner what="section" />}
          </Container>
        </section>
      )}

      {/* ── 9. At a glance: plain facts for customers, search engines and AI answers ── */}
      <section aria-labelledby="facts-heading" className="border-b border-line bg-surface py-16 sm:py-24">
        <Container size="narrow">
          <h2 id="facts-heading" className="text-3xl text-fg sm:text-4xl">
            Ayyara Rebirth at a glance
          </h2>
          <dl className="mt-8 divide-y divide-line border-y border-line text-[15px]">
            {[
              { label: 'Based in', value: 'Malappuram, Kerala, India' },
              { label: 'What we make', value: `Perfumes${concentrations.length ? ` (${concentrations.join(', ').toLowerCase()})` : ''} in three collections: ${collections.map((collection) => collection.title).join(', ')}` },
              { label: 'Delivery', value: `Free across India; dispatched within ${site.policies.dispatchWindow} and delivered in ${site.policies.deliveryWindow}` },
              { label: 'Returns', value: `Unopened products within ${site.policies.returnWindowDays} days of delivery` },
              { label: 'Customer care', value: `${site.contact.phone} · ${site.contact.email} · ${site.contact.hours}` },
              { label: 'Address', value: site.contact.address },
            ].map((fact) => (
              <div key={fact.label} className="grid grid-cols-[8rem_1fr] gap-4 py-3.5 sm:grid-cols-[10rem_1fr]">
                <dt className="text-mute">{fact.label}</dt>
                <dd className="text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-fg-soft">
            More in our <Link href="/faq" className="text-fg underline underline-offset-4">FAQ</Link>, <Link href="/shipping-returns" className="text-fg underline underline-offset-4">delivery &amp; returns</Link> and <Link href="/contact" className="text-fg underline underline-offset-4">contact</Link> pages.
          </p>
        </Container>
      </section>

      {/* ── 10. VIP Newsletter (Discover Your Signature) ─────────────── */}
      <section className="bg-canvas py-16 sm:py-24">
        <Container size="narrow">
          <div className="rounded-sm border border-line bg-surface p-8 sm:p-12">
            <div className="text-center">
              <span className="font-sans text-xs font-semibold tracking-[0.25em] text-mute uppercase">
                Private Correspondence
              </span>
              <h2 className="mt-2 text-3xl tracking-wide text-fg uppercase sm:text-4xl">
                Discover Your Signature
              </h2>
              <p className="mx-auto mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-mute">
                We are crafting fragrances designed to leave a lasting impression. Leave your details below to stay
                updated on our upcoming launches, exclusive offers, and brand journey.
              </p>
            </div>

            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-12 text-center">
            <ButtonLink href="/shop" size="lg" className="w-full sm:w-auto">
              Discover the Collection
            </ButtonLink>
          </div>
        </Container>
      </section>
      <JsonLd data={aboutPageJsonLd()} />
    </article>
  );
}
