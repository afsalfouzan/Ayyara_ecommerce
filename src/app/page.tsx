import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HomeProductCard } from '@/components/home/HomeProductCard';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { Icon, type IconName } from '@/components/ui/icons';
import { bestSellerListings, getBestSellerIds, getProducts } from '@/lib/catalog';
import { imagery } from '@/lib/imagery';
import { shareMeta } from '@/lib/seo';

/*
 * Home page, built to the "L'Élixir Noir" design: near-black surfaces, warm
 * champagne accents, Playfair Display headings. The design was drawn for a
 * phone; from the `sm` and `lg` breakpoints the same sections open out into
 * columns. The header and its navigation are the site's own, not the design's.
 */
export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: shareMeta('/') };

const collectionCards = [
  { href: '/shop/men', photo: imagery.men, edition: 'Édition Noir // Pour Homme', title: 'For Him', line: 'Bold, refined fragrances that leave a lasting impression.' },
  { href: '/shop/women', photo: imagery.women, edition: 'Édition Florale // Pour Femme', title: 'For Her', line: 'Elegant, captivating scents that express your individuality.' },
  { href: '/shop', photo: imagery.unisex, edition: 'Édition Universelle // Non-Genrée', title: 'Unisex Collection', line: 'Distinctive fragrances beyond labels, made for anyone who wears them their way.' },
] as const;

const notePyramid = [
  { stage: 'I. Top Notes — The Awakening', time: '0 - 30 Mins', title: 'Crisp Bergamot, Honey Nectar & Wild Pome', text: 'A luminous opening sparkle bursting with Mediterranean citrus zest and raw comb nectar.', surface: 'bg-[#201f1f]' },
  { stage: 'II. Heart Notes — The Soul', time: '2 - 6 Hours', title: 'White Magnolia & Roasted Almond', text: 'Intoxicating floral radiance infused with warm roasted creaminess and crushed velvety buds.', surface: 'bg-[#2a2a2a]' },
  { stage: 'III. Base Notes — The Sillage', time: '8 - 24+ Hours', title: 'Smoked Cedar, Amber Noir & Bourbon Vanilla', text: 'Rich dark woods cured with ancient resins, radiating an indelible trail of quiet power.', surface: 'bg-[#353534]' },
] as const;

const tenets: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: '100% Satisfaction Guarantee', text: 'Test the included 2ml discovery vial first; full return if unboxed flacon is untouched.' },
  { icon: 'flask', title: '28% Extrait de Parfum', text: 'Uncompromising maceration grade yielding 14+ hours of rich skin intimacy.' },
  { icon: 'truck', title: 'Swift & Secure Delivery', text: 'Insured velvet padded dispatch directly from our Veliyamthode atelier across India.' },
];

/** Small spaced-out label with a hairline on each side, used above section headings. */
function Eyebrow({ children }: { children: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <span className="h-px w-5 bg-champagne/30" />
      <span className="text-[10px] font-semibold tracking-[0.35em] text-champagne/90 uppercase">{children}</span>
      <span className="h-px w-5 bg-champagne/30" />
    </div>
  );
}

export default async function HomePage() {
  const [products, rankedIds] = await Promise.all([getProducts(), getBestSellerIds()]);
  const bestSellers = bestSellerListings(products, rankedIds);

  return (
    <div className="relative w-full overflow-hidden bg-[#131313] text-[#e5e2e1]">
      {/* Ambient glows behind the page */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 aspect-square w-[140%] max-w-[1400px] -translate-x-1/2 bg-[radial-gradient(circle_at_50%_20%,rgba(219,195,161,0.18)_0%,rgba(219,195,161,0.03)_45%,transparent_70%)] blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute top-[40%] right-[-20%] h-[480px] w-[320px] bg-[radial-gradient(ellipse_at_center,rgba(78,72,63,0.35)_0%,transparent_75%)] blur-3xl lg:right-0 lg:w-[520px]" />

      {/* Hero: the photo fills the screen on a phone and takes the right half on a laptop, where it stays sharp. */}
      <section className="relative flex min-h-[620px] w-full flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 lg:min-h-[680px] lg:justify-center lg:bg-[#131313] lg:px-12 lg:pb-0">
        <div className="absolute inset-y-0 right-0 z-0 w-full overflow-hidden lg:w-[52%]">
          <Image src={imagery.hero.src} alt={imagery.hero.alt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 52vw, 160vw" quality={85} placeholder="blur" className="h-full w-full scale-[1.02] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#0e0e0e]/70 to-[#131313]/85 lg:via-transparent lg:to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_35%,rgba(14,14,14,0.85)_95%)] lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#131313] via-[#131313]/25 to-transparent lg:block" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-none">
          <div className="mb-auto flex flex-col items-center pt-6 text-center lg:mb-8 lg:items-start lg:pt-0 lg:text-left">
            <span className="text-[10px] font-semibold tracking-[0.35em] text-champagne uppercase drop-shadow-md">A House of Luxury Perfumes</span>
            <div className="mt-2 h-px w-8 bg-champagne/40" />
          </div>

          <div className="mx-auto mt-32 flex w-full max-w-sm flex-col items-center text-center lg:mx-0 lg:mt-0 lg:max-w-xl lg:items-start lg:text-left">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-sand uppercase drop-shadow">N° 05 Extrait Édition • Epic Scent Alchemy</span>
            <span className="mt-1 text-[9px] font-semibold tracking-[0.25em] text-champagne/80 uppercase">Pure Extrait Concentration</span>
            <h1 className="mt-3 font-playfair text-[28px] leading-9 tracking-tight text-white drop-shadow-md sm:text-4xl sm:leading-[44px] lg:text-[56px] lg:leading-[64px] lg:tracking-[-0.02em]">REBIRTH OF THE SENSES</h1>
            <p className="mt-3 text-[13px] leading-relaxed text-mist drop-shadow lg:mt-5 lg:text-lg lg:leading-7 lg:font-light">For the modern vanguard. Fine fragrances forged through artisanal distillation, ancient resins, and luminous shadows.</p>
            <Link href="/shop" className="btn-champagne mt-6 w-full rounded-xl px-8 py-3.5 text-center text-[11px] font-medium tracking-[0.22em] uppercase lg:mt-8 lg:w-auto lg:px-10">
              <span className="relative z-10">SHOP NOW — THE COLLECTION</span>
            </Link>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium tracking-wide text-sand drop-shadow">
              <Icon name="badgeCheck" className="h-3.5 w-3.5 shrink-0 text-champagne" />
              <span>Complimentary 2ml discovery vial with every flacon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="relative bg-[#0e0e0e]/60 px-5 py-10 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>Curated Portfolios</Eyebrow>
            <h2 className="font-playfair text-[30px] leading-tight font-normal tracking-wide text-ivory md:text-[40px] md:leading-[48px]">Discover Your Signature Scent</h2>
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ash md:max-w-md md:text-[15px]">Explore fragrances crafted for every identity, every mood, and every moment.</p>
            <div className="mt-3 h-px w-10 bg-champagne/20" />
          </div>

          {/* One column on phones, three from tablets up, so no card is left on a row of its own. */}
          <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-8 md:max-w-none md:grid-cols-3 md:gap-4 lg:gap-6">
            {collectionCards.map((card) => (
              <article key={card.title} className="card-noir group relative flex flex-col overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-[0_24px_50px_rgba(0,0,0,0.9)]">
                <div className="relative aspect-square w-full overflow-hidden">
                  {/* A square crop of a 4:3 photo: it needs about a third more pixels than the card is wide. */}
                  <Image src={card.photo.src} alt={card.photo.alt} fill sizes="(min-width: 768px) 44vw, (min-width: 480px) 600px, 134vw" quality={85} placeholder="blur" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100f0e] via-[#100f0e]/35 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_45%,rgba(10,10,10,0.65)_100%)]" />
                  <div className="chip-noir absolute top-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-1.5 rounded-xl px-3.5 py-1 shadow-lg">
                    <Icon name="sparkle" strokeWidth={2} className="h-3 w-3 shrink-0 text-champagne/90" />
                    <span className="truncate text-[9px] font-medium tracking-[0.22em] text-[#eae7df] uppercase">{card.edition}</span>
                  </div>
                  <span className="chip-noir absolute right-4 bottom-4 rounded-xl px-2.5 py-1 text-[9px] font-semibold tracking-wider text-champagne/90 uppercase shadow-sm">28% Extrait</span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-4 lg:p-6">
                  <h3 className="font-playfair text-[26px] leading-tight tracking-tight text-ivory md:text-[22px] lg:text-[26px]">{card.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed font-light text-ash">{card.line}</p>
                  <div className="rule-champagne my-4" />
                  <div className="mt-auto flex flex-col items-start gap-4">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[10px] tracking-[0.22em] text-champagne/70 uppercase">Concentration</span>
                      <span className="h-1 w-1 rounded-full bg-champagne/30" />
                      <span className="font-playfair text-sm tracking-wide whitespace-nowrap text-[#eae7df]">Rare Extrait 28%</span>
                    </div>
                    <Link href={card.href} className="btn-champagne group/btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase md:px-3.5 md:tracking-[0.14em] lg:px-5 lg:tracking-[0.2em]">
                      <span className="relative z-10">Explore Collection</span>
                      <Icon name="arrowRight" strokeWidth={2} className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      <span className="sr-only">: {card.title}</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section id="collection" className="relative bg-[#0e0e0e]/40 px-5 py-12 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-center text-center md:mb-14">
            <Eyebrow>Permanent Exhibition</Eyebrow>
            <h2 className="font-playfair text-[32px] leading-tight font-normal tracking-wide text-[#f7f5f0] md:text-[40px] md:leading-[48px]">Rare Extraits</h2>
            <p className="mt-1.5 max-w-sm text-[13px] font-light tracking-wide text-champagne/80 md:text-[15px]">Hand-poured 60ml bottles in numbered micro-batches</p>
            <div className="mt-3.5 h-px w-12 bg-champagne/30" />
          </div>
          {bestSellers.length === 0 ? (
            <p className="card-noir mx-auto max-w-xl rounded-2xl p-10 text-center text-sm text-mist">The collection is being restocked. Please check back soon.</p>
          ) : (
            <div className={`mx-auto grid grid-cols-1 gap-8 ${bestSellers.length === 1 ? 'max-w-md' : bestSellers.length === 2 ? 'max-w-4xl sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {bestSellers.map((listing) => (
                <HomeProductCard key={listing.variant.id} listing={listing} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link href="/shop" className="text-[11px] font-semibold tracking-[0.25em] text-champagne uppercase underline decoration-champagne/40 underline-offset-8 transition-colors hover:text-white">
              View all perfumes
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy and the three stages of a fragrance */}
      <section className="relative bg-[linear-gradient(rgb(20,19,18)_0%,rgb(26,25,23)_50%,rgb(20,19,18)_100%)] px-5 py-12 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-champagne uppercase">Provenance &amp; Philosophy</span>
              <h2 className="mt-1 font-playfair text-[28px] leading-9 text-[#f7f5f0] md:text-[40px] md:leading-[48px]">More Than A Fragrance, An Identity</h2>
              <div className="my-4 h-px w-12 bg-[#4e483f]" />
              <p className="max-w-sm text-[15px] leading-relaxed font-light text-mist lg:max-w-lg lg:text-lg lg:leading-7">
                We believe a perfume is your invisible, unforgettable signature. Crafted to capture memories and evoke deep emotions, our collections bridge the gap between ancient botanical distillation and modern luxury.
              </p>
              <Link href="/our-story" className="mt-6 text-[11px] font-semibold tracking-[0.25em] text-champagne uppercase underline decoration-champagne/40 underline-offset-8 transition-colors hover:text-white">
                Discover our story
              </Link>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[rgb(200_182_155/0.15)] bg-[#2a2a2a] shadow-xl">
              {/* A wide crop of a square photo, so it is drawn at the box's full width. */}
              <Image src={imagery.hero.src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" quality={85} placeholder="blur" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 text-[11px] font-semibold tracking-widest text-[#ede9df] uppercase">
                <span>Kerala Atelier Reserve</span>
                <span className="text-right">Zero Synthetic Fillers</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 md:mt-12 lg:grid-cols-3 lg:gap-5">
            {notePyramid.map((note) => (
              <div key={note.stage} className={`flex flex-col gap-1 rounded-xl border border-[rgb(207_190_158/0.12)] p-4 shadow-md lg:p-6 ${note.surface}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-champagne uppercase">{note.stage}</span>
                  <span className="shrink-0 text-[11px] font-medium text-sand">{note.time}</span>
                </div>
                <p className="font-playfair text-[17px] leading-snug text-[#f7f5f0] lg:mt-1 lg:text-xl">{note.title}</p>
                <p className="text-xs leading-relaxed font-light text-mist lg:text-[13px]">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the house promises */}
      <section className="relative px-5 py-10 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <h2 className="mb-4 border border-[rgb(200_182_155/0.15)] bg-[linear-gradient(rgb(26,25,24)_0%,rgb(19,18,17)_100%)] py-1.5 text-center text-[10px] font-semibold tracking-[0.3em] text-champagne uppercase">The Atelier Standard</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
            {tenets.map((tenet) => (
              <div key={tenet.title} className="flex items-center gap-4 rounded-xl border border-[rgb(200_182_155/0.14)] bg-[linear-gradient(rgb(25,24,23)_0%,rgb(18,17,16)_100%)] p-4 shadow-md md:flex-col md:items-start md:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#201f1f] text-champagne shadow-[0_0_15px_rgba(219,195,161,0.15)]">
                  <Icon name={tenet.icon} strokeWidth={1.6} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-playfair text-base font-medium text-white md:text-lg">{tenet.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-mist md:mt-1 md:text-[13px]">{tenet.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up */}
      <section className="relative px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-xl bg-[#201f1f] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(219,195,161,0.06)] sm:p-8 md:p-10">
          <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 bg-[radial-gradient(circle,rgba(219,195,161,0.12)_0%,transparent_70%)]" />
          <div className="flex flex-col items-center text-center">
            <Icon name="lockOpen" strokeWidth={1.6} className="h-7 w-7 text-champagne" />
            <span className="mt-2 text-[11px] font-semibold tracking-[0.3em] text-champagne uppercase">The Private Circle</span>
            <h2 className="mt-1 font-playfair text-[22px] leading-[30px] font-medium text-white md:text-[28px] md:leading-9">Invitations to Rare Extraits</h2>
            <p className="mt-2 max-w-xs text-[13px] leading-5 text-mist md:max-w-sm">Reserve priority access to bespoke barrel aged releases and private salon samplings.</p>
          </div>
          <div className="relative mt-6">
            <NewsletterForm look="circle" />
          </div>
        </div>
      </section>
    </div>
  );
}
