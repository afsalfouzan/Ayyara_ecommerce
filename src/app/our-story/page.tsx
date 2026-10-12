import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Award, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { NewsletterForm } from '@/components/home/NewsletterForm';
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

const IMAGES = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyj2zYHKaTfBDJ7peekdntSFyGbpcKSwadF5RwN2oxRhhYAhxMeIAi4PsdkZQ8Rh03Y4H8y49e4ElG5lJpudQj67bL2I-scnKgMJ20DP2BevvNdGx3leXKItmydg6jm-93qy1fuxzh89hU-6ojJblgE0V3kvYPmwkjPPJjRzng-AmdzebGiCRooMkO1GvxHMsUkd_KHCbjRhTNWR0milL77mFpv90P0P7PKkDtK83UEwhpYseM9Q3bMQ',
  chapter1:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuByNancxr5_anqdvTYgIs7JpdfmkgRm7tEv8CHYPGSNJqUGU9Y1uD8zzMq93Ir0iP92nSLa4nYzqwK_dGiEqQcQLWr6vlGgc6mxZ6JXkdekZUFqYVoqO8gQCXsxT0BLhtlWAc0ozvKrgXcTrFqnftWbAA3-pkXxLAdEYGX0Jjw3y3BCAD59pf0c-A5U71iiMNG7CnXGMiRweAbg0D0N-1Qp77vpfBrUcYmkppsN467jEDzQJwfyszd4bQ',
  water:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtdqKWHSZqVbsBml4faZpIb6IEFiboRiHRC_rAF29-uoRzqJo16_Bfi4egJ84_8GJJXbmJLiaGlh75fOHs_Ht9Do0anfCP1fveg815iMDrdYDk_CwTuOSu78VNrLnevXXzNO5nzt3YtMX9XrSIFPCpWn0vdMvol4DufxHkRxGtZZ-9GTfU53Aju8SsqAnmIkCN8HhN0HGdD_V0vgblUR2cDUlrvWjqR-SX3aTtGeMEWweOUJ189FGmOw',
  chapter2:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIsKRWjs0LPm4BKx-lshQBDUyEBCU4uxGxgDb-xvInEVESKLzbregMEpTtKPRo5Q-sQcYN-bWclpbjjpXVX4b_s86tL2sFFYds0NohhWhlYX8b0Y4GjKkHtrM7G4HCEFJwnojb7ARH7PVaf_oMYUEqcsl6Mw5RKIcBw5uuegtd7r9B_dnA6cwMJXcm9mEiXMSIGVSdxYv9iyLuotkAG26RgyVh-wZRXdY-ExYlLhjwI8D8XrpmfSz6bg',
};

export default function OurStoryPage() {
  return (
    <article className="relative w-full bg-[#0e0e0e] text-stone-200 antialiased selection:bg-[#c5a059]/30 selection:text-white">
      {/* ── 1. Hero Section ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden border-b border-white/10 sm:min-h-[580px] lg:min-h-[640px]">
        <Image
          src={IMAGES.hero}
          alt="Misty canopy forest landscape in black and white, dramatic atmospheric monochrome foliage, ancient trees reaching through morning haze"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center opacity-70 transition-transform duration-1000 ease-out hover:scale-105"
        />
        {/* Cinematic dark vignette scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-[#0e0e0e]/75" />

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
      <section className="border-b border-white/10 bg-[#0e0e0e] py-16 sm:py-24">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-[#c5a059]/60" />
          <p className="font-serif text-xl font-light leading-relaxed text-stone-100 italic sm:text-2xl sm:leading-loose lg:text-3xl">
            “At Ayyara Rebirth, our formulation is a love letter to the earth’s raw and untamed landscapes. We believe
            the truest modern alchemy is simply allowing nature to speak for itself. We harvest bright, living
            botanicals and ground them in deep, earthy elements, creating a fragrance that breathes and evolves with you
            naturally.”
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-[#c5a059]/60" />
        </Container>
      </section>

      {/* ── 3. Chapter I · The Dialogue ─────────────────────────────── */}
      <section className="border-b border-white/10 py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 bg-neutral-900 sm:aspect-[16/10]">
            <Image
              src={IMAGES.chapter1}
              alt="Antique typewriter beside a crystalline perfume flacon labeled Ayyara on a weathered studio desk"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col justify-center text-center lg:text-left">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase">
              Chapter I · The Dialogue
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal text-white sm:text-4xl">
              An Ode to the Earth’s Elements
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-stone-300 sm:text-lg">
              Born from a deep reverence for nature, Ayyara Rebirth is where the earth’s finest elements meet modern
              alchemy. We look to the natural world not just for our ingredients, but for our inspiration. We source
              from the most vibrant landscapes to create botanical blends that truly awaken the senses.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border-b border-[#c5a059] pb-1 font-sans text-sm font-medium tracking-widest text-[#cec5b9] uppercase transition-colors hover:text-white"
              >
                Discover the Scent Notes &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. Chapter II · The Resonance ───────────────────────────── */}
      <section className="border-b border-white/10 py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex flex-col justify-center text-center lg:order-1 lg:text-left">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase">
              Chapter II · The Resonance
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal text-white sm:text-4xl">
              Bottling the Essence of Rebirth
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-stone-300 sm:text-lg">
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
            <div className="relative h-32 w-full overflow-hidden rounded-sm border border-white/10 sm:h-36">
              <Image
                src={IMAGES.water}
                alt="Delicate concentric water ripples disturbance, liquid gloss texture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/80 via-transparent to-[#0e0e0e]/80" />
            </div>

            {/* Velvet armchair flacon monograph */}
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 sm:aspect-[16/10]">
              <Image
                src={IMAGES.chapter2}
                alt="Clear glass luxury perfume bottle resting on deep velvet vintage armchair beside art monograph book"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 5. Natural Elegance (Philosophy Callout) ────────────────── */}
      <section className="border-b border-white/10 bg-[#141414] py-16 sm:py-24">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-[#c5a059]">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#cec5b9] uppercase">
            Pure Philosophy
          </span>
          <h2 className="mt-2 font-serif text-3xl font-normal text-white sm:text-4xl">Natural Elegance</h2>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-stone-300 sm:text-lg sm:leading-loose">
            Born from the earth, Ayyara Rebirth is a return to natural elegance. We see modern alchemy as a collaboration
            with nature distilling sunlit botanicals and deep, grounding woods into living, breathing rituals. By
            stripping away the unnecessary, we let the purest elements speak for themselves. Whether through scent or
            clean beauty, our promise is simply an invitation to reconnect, awaken, and experience your own rebirth.
          </p>
        </Container>
      </section>

      {/* ── 6. Sacred Tenets / Atelier Distinctions ─────────────────── */}
      <section className="border-b border-white/10 py-16 sm:py-24">
        <Container>
          <div className="text-center">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase">
              Our Sacred Tenets
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal text-white sm:text-4xl">Atelier Distinctions</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col items-center rounded-sm border border-white/10 bg-[#141414] p-8 text-center transition-all duration-300 hover:border-white/20 hover:bg-neutral-900">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-[#c5a059] border border-white/10">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-white">100% Satisfaction Guarantee</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-stone-400">
                Your complete satisfaction is at the heart of what we do. We are dedicated to ensuring every Ayyara
                Rebirth experience delights you from the first spray.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center rounded-sm border border-white/10 bg-[#141414] p-8 text-center transition-all duration-300 hover:border-white/20 hover:bg-neutral-900">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-[#c5a059] border border-white/10">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-white">Uncompromising Quality</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-stone-400">
                Formulated with exceptional care, using only the finest premium ingredients to meet the absolute highest
                standards of modern luxury.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center rounded-sm border border-white/10 bg-[#141414] p-8 text-center transition-all duration-300 hover:border-white/20 hover:bg-neutral-900">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-[#c5a059] border border-white/10">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-white">Swift &amp; Secure Delivery</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-stone-400">
                Packaged with elegance and handled with the utmost care, ensuring your new signature scent arrives safely
                and promptly to your door.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 7. VIP Newsletter (Discover Your Signature) ─────────────── */}
      <section className="bg-[#0e0e0e] py-16 sm:py-24">
        <Container size="narrow">
          <div className="rounded-sm border border-white/10 bg-[#141414] p-8 sm:p-12">
            <div className="text-center">
              <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase">
                Private Correspondence
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal tracking-wide text-white uppercase sm:text-4xl">
                Discover Your Signature
              </h2>
              <p className="mx-auto mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-stone-400">
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
    </article>
  );
}
