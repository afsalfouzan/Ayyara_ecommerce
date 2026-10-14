import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CampaignFilm } from '@/components/home/CampaignFilm';
import { HeroVideo } from '@/components/home/HeroVideo';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductCard } from '@/components/product/ProductCard';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/icons';
import { bestSellerListings, getBestSellerIds, getProducts } from '@/lib/catalog';
import { film, heroFilm, imagery } from '@/lib/imagery';
import { shareMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';

/*
 * Home page, laid out like a short fragrance editorial. Each section has its
 * own composition so the page has a rhythm:
 *   hero          the campaign film, playing silently, with a few words
 *   collections   three photos of different shapes, numbered like chapters
 *   the film      the ONE campaign film, as a still that plays in place, on white
 *   best sellers  a heading column beside the product tiles
 *   the house     one large line of text on the deeper beige
 *   service       three plain facts from the shop's own policies
 *   sign-up       a narrow, centred form
 * Light throughout; the photographs carry the colour.
 */
export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: shareMeta('/') };

const exploreLink = 'inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-fg uppercase';

/** The three collections, each shown in a different shape: one tall, two wide. */
const collections = [
  { number: '01', href: '/shop/men', title: 'For Him', line: 'Strength and refinement.', photo: imagery.men, frame: 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[640px]', sizes: '(min-width: 1024px) 60vw, 135vw', cell: 'lg:col-span-5 lg:row-span-2' },
  { number: '02', href: '/shop/women', title: 'For Her', line: 'Delicate power, from day to night.', photo: imagery.women, frame: 'aspect-[4/3] lg:aspect-[16/9]', sizes: '(min-width: 1024px) 60vw, 100vw', cell: 'lg:col-span-7' },
  { number: '03', href: '/shop/unisex', title: 'Unisex', line: 'Made to be shared.', photo: imagery.unisex, frame: 'aspect-[4/3] lg:aspect-[16/9]', sizes: '(min-width: 1024px) 60vw, 100vw', cell: 'lg:col-span-7' },
] as const;

const services = [
  { title: 'Free delivery', text: `Across India, in ${site.policies.deliveryWindow.replace(' across India', '')}` },
  { title: `${site.policies.returnWindowDays}-day returns`, text: 'On unopened products' },
  { title: 'Secure payment', text: 'UPI, cards and net banking' },
];

export default async function HomePage() {
  const [products, rankedIds] = await Promise.all([getProducts(), getBestSellerIds()]);
  const bestSellers = bestSellerListings(products, rankedIds);

  return (
    <>
      {/*
       * Hero: the campaign film, playing by itself, silent and on a loop.
       * Phone: the film fills the screen between the header and the bar of shortcuts (4rem each),
       * with the words laid over its foot; the page scrolls on beneath it.
       * Laptop: an uneven split. The film is tall, so it takes the wider right-hand column at the
       * full height of the screen, where it stays sharp, and the words sit on ivory beside it.
       */}
      <section className="relative lg:grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[6fr_7fr] lg:items-stretch">
        <HeroVideo src={heroFilm.src} poster={heroFilm.poster} label={heroFilm.label} className="relative h-[calc(100svh-8rem-env(safe-area-inset-bottom,0px))] min-h-[480px] w-full overflow-hidden bg-raised lg:order-2 lg:h-auto lg:min-h-[620px]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col px-5 pb-7 text-white sm:px-8 sm:pb-10 lg:static lg:order-1 lg:justify-center lg:py-14 lg:pr-8 lg:pl-12 lg:text-fg xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <p className="eyebrow text-white/85! lg:text-mute!">{site.name}</p>
          <h1 className="mt-3 text-[2.375rem] whitespace-nowrap sm:text-6xl lg:text-[2.875rem] xl:text-[3.75rem]">
            Fine Fragrance
            <br />
            <span className='text-[2rem]'>For Modern You</span>
          </h1>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-white/85 lg:mt-6 lg:text-lg lg:text-mute">Discover a fragrance that expresses your individuality.</p>
          <div className="mt-5 lg:mt-9">
            <ButtonLink href="/shop" size="lg" className="w-full bg-white! text-fg! hover:bg-white/90! sm:w-auto lg:bg-fg! lg:text-white! lg:hover:bg-fg-soft!">
              Explore fragrances
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Collections: one tall photo beside two wide ones, numbered like chapters. */}
      <Container as="section" id="collections" className="scroll-mt-20 py-14 md:py-24">
        <div className="max-w-xl">
          <p className="eyebrow">The collections</p>
          <h2 className="mt-2 font-display text-[2rem] text-fg md:text-5xl">Three ways to wear Ayyara</h2>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:mt-12 lg:grid-cols-12 lg:grid-rows-2 lg:gap-y-8">
          {collections.map((collection) => (
            <li key={collection.number} className={collection.cell}>
              <Link href={collection.href} className="group flex h-full flex-col">
                <div className={`relative w-full flex-1 overflow-hidden bg-surface ${collection.frame}`}>
                  <Image src={collection.photo.src} alt={collection.photo.alt} fill sizes={collection.sizes} quality={85} placeholder="blur" className={`object-cover ${collection.photo.position} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]`} />
                </div>
                <div className="mt-4 flex items-baseline gap-4">
                  <span className="text-xs tracking-[0.14em] text-gold tabular-nums">{collection.number}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl leading-tight text-fg md:text-3xl">{collection.title}</h3>
                    <p className="mt-1 text-sm text-mute text-nowrap">{collection.line}</p>
                  </div>
                  <span className={`${exploreLink} shrink-0`}>
                    <span className="border-b border-fg pb-0.5">Explore</span>
                    <Icon name="arrowRight" strokeWidth={1.5} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* The campaign film: a portrait still with a play button, beside a few words. */}
      <section className="bg-surface">
        <Container className="grid grid-cols-1 items-center gap-8 py-14 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-2 lg:max-w-none">
            {/* The bottle sits in the middle of the frame, so a shorter crop on phones keeps it whole. */}
            <CampaignFilm src={film.src} poster={film.poster} posterAlt={film.posterAlt} title={film.title} frameClassName="aspect-[4/5] sm:aspect-[9/16]" />
          </div>
          <div className="lg:col-span-5 lg:col-start-7">
            <p className="eyebrow">The film</p>
            <h2 className="mt-2 font-display text-[2rem] text-fg md:text-5xl">
              More Than a Fragrance
              <br />
              An Identity
            </h2>
            <p className="mt-1 text-sm tracking-[0.08em] text-mute">by Ayyara Rebirth</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mute">We believe a perfume is your invisible, unforgettable signature. Crafted to capture memories and evoke deep emotions, our collections bridge the gap between tradition and modern luxury. Step into our world and explore how our signature scents are born.</p>
            <Link href={'/shop'} className={`${exploreLink} mt-7 border-b border-fg pb-0.5`}>
              Explore fragrances
            </Link>
          </div>
        </Container>
      </section>

      {/* Best sellers: a heading column beside the product tiles. */}
      <section>
        <Container className="grid grid-cols-1 gap-8 py-14 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4 lg:pt-2">
            <p className="eyebrow">Most loved</p>
            <h2 className="mt-2 font-display text-[2rem] text-fg md:text-5xl">The best sellers</h2>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-mute">The fragrances our customers return to.</p>
            <Link href="/shop" className={`${exploreLink} mt-6 border-b border-fg pb-0.5`}>
              Shop all perfumes
            </Link>
          </div>
          {bestSellers.length === 0 ? (
            <p className="border border-line p-10 text-center text-sm text-mute lg:col-span-8">The collection is being restocked. Please check back soon.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:col-span-8">
              {bestSellers.map((listing) => (
                <li key={listing.variant.id}>
                  <ProductCard listing={listing} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* The house: one large line on the deeper beige, with no photo, as a pause between the product sections. */}
      <section className="bg-raised">
        <Container className="py-16 text-center md:py-28">
          <p className="eyebrow">The house</p>
          <p className="mx-auto mt-4 max-w-3xl font-display text-[1.875rem] leading-[1.2] text-fg md:text-5xl md:leading-[1.15]">A perfume is your invisible, unforgettable signature.</p>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-mute">Each Ayyara fragrance is composed to hold a memory and to be remembered.</p>
          <Link href="/our-story" className={`${exploreLink} mt-8 border-b border-fg pb-0.5`}>
            Our story
          </Link>
        </Container>
      </section>

      {/* Three plain facts about every order. */}
      <section className="border-b border-line">
        <Container as="ul" className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {services.map((service) => (
            <li key={service.title} className="py-5 text-center sm:px-4 sm:py-8">
              <p className="text-xs font-medium tracking-[0.14em] text-fg uppercase">{service.title}</p>
              <p className="mt-1.5 text-sm text-mute">{service.text}</p>
            </li>
          ))}
        </Container>
      </section>

      {/* Sign-up */}
      <Container as="section" className="py-14 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Stay in touch</p>
          <h2 className="mt-2 font-display text-[2rem] text-fg md:text-5xl">Be first to know</h2>
          <p className="mt-3 text-base leading-relaxed text-mute">New fragrances and offers, sent occasionally.</p>
          <div className="mt-7 text-left">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      {/* Who the shop is and the site itself, for search engines and AI answers. */}
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
    </>
  );
}
