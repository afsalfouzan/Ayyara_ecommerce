import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import oilConcentration from '@/assets/product/oil-concentration.jpg';
import { BestSellerSlider } from '@/components/home/BestSellerSlider';
import { FilmGrid, FilmSlider } from '@/components/home/FilmSlider';
import { HeroVideo } from '@/components/home/HeroVideo';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductCard } from '@/components/product/ProductCard';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/icons';
import { bestSellerListings, CONCENTRATION, getBestSellerRanking, getProducts } from '@/lib/catalog';
import { auraFilm, film, heroFilm, imagery, legacyFilm } from '@/lib/imagery';
import { shareMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';

/*
 * Home page, laid out like a short fragrance editorial. Each section has its
 * own composition so the page has a rhythm:
 *   hero          a banner: the campaign film, full screen on phones, a tall panel in a wide dark banner on laptops
 *   best sellers  every perfume, most sold first, on a belt that moves by itself and can be swiped either way, under a heading row
 *   profile       the perfume-oil comparison image, on white
 *   the films     the ONE, LEGACY and AURA campaign films as stills that play in place: a self-moving belt on phones, three tiles in a row on laptops
 *   collections   three photos of the same size, numbered like chapters, on white
 *   service       three plain facts from the shop's own policies
 *   sign-up       a narrow, centred form
 * Light throughout; the photographs carry the colour. Below the hero, each part fades
 * up into place as it scrolls into view (data-reveal, see ScrollReveal).
 */
export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: shareMeta('/') };

const films = [film, legacyFilm, auraFilm];

const exploreLink = 'inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-fg uppercase';

/** The three collections: one photo each, side by side and the same size on laptops. */
const collections = [
  { number: '01', href: '/shop/men', title: 'Men’s Collections', line: 'Strength and refinement.', photo: imagery.men },
  { number: '02', href: '/shop/women', title: 'Women’s Collections', line: 'Delicate power, from day to night.', photo: imagery.women },
  { number: '03', href: '/shop/unisex', title: 'Unisex', line: 'Made to be shared.', photo: imagery.unisex },
] as const;

const services = [
  { title: 'Free delivery', text: `Within ${site.policies.deliveryArea}, in ${site.policies.deliveryTime}` },
  { title: `${site.policies.returnWindowDays}-day returns`, text: 'On unopened products' },
  { title: 'Secure payment', text: 'UPI, cards and net banking' },
];

export default async function HomePage() {
  const [products, ranking] = await Promise.all([getProducts(), getBestSellerRanking()]);
  const bestSellers = bestSellerListings(products, ranking);

  return (
    <>
      {/*
       * Hero banner: the campaign film, playing silently on a loop.
       * Phone and tablet: the film fills the screen between the header and the bar of shortcuts (4rem each),
       * with the words laid over its foot.
       * Laptop: the banner fills the screen under the header. The film is a full-height panel on the right whose
       * left edge melts into the black; the words sit on the left, on the same grid as the header logo, centred
       * vertically. A faint vignette, a soft glow behind the words and a gold hairline add depth.
       */}
      <section className="relative overflow-hidden bg-black">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          {/* Warm champagne glow behind the headline, and a cool steel-blue one by the film. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_52%_at_24%_50%,rgba(214,186,140,0.07),rgba(214,186,140,0.03)_45%,transparent_75%),radial-gradient(ellipse_30%_55%_at_52%_55%,rgba(110,150,190,0.045),transparent_75%)]" />
          {/* Soft vignette, stronger toward the left and bottom edges. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.55)_100%),linear-gradient(to_right,rgba(0,0,0,0.5),transparent_22%),linear-gradient(to_top,rgba(0,0,0,0.5),transparent_25%)]" />
          {/* Fine film grain. */}
          <div className="hero-grain absolute inset-0" />
        </div>
        <div className="lg:mx-auto lg:flex lg:min-h-[max(600px,calc(100svh-5rem))] lg:max-w-7xl lg:items-center lg:px-12">
          <HeroVideo src={heroFilm.src} poster={heroFilm.poster} label={heroFilm.label} className="relative h-[calc(100svh-8rem-env(safe-area-inset-bottom,0px))] min-h-[480px] w-full overflow-hidden bg-raised lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:min-h-0 lg:w-1/2 lg:bg-black lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.03)_5%,rgba(0,0,0,0.12)_11%,rgba(0,0,0,0.3)_17%,rgba(0,0,0,0.55)_23%,rgba(0,0,0,0.78)_29%,rgba(0,0,0,0.93)_36%,#000_44%)] xl:w-[54%] min-[1700px]:w-1/2 lg:[&>video]:object-[50%_55%] lg:[&>video]:animate-[hero-drift_30s_ease-out_both]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent lg:hidden" />
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-7 text-white sm:px-8 sm:pb-10 lg:static lg:w-1/2 lg:py-16 lg:pr-0 lg:pl-0">
            <span aria-hidden className="hero-rise mb-6 hidden h-px w-14 bg-gold/80 lg:block" style={{ '--rise-delay': '100ms' } as React.CSSProperties} />
            <p className="eyebrow hero-rise text-white/85!" style={{ '--rise-delay': '200ms' } as React.CSSProperties}>{site.name}</p>
            <h1 className="hero-rise mt-3 text-[2.35rem] tracking-[0.02em] whitespace-nowrap sm:text-6xl lg:mt-4 lg:text-[3.25rem] xl:text-[4rem]" style={{ '--rise-delay': '350ms' } as React.CSSProperties}>
              Fine Fragrances
              <br />
              <span className="text-[1.875rem] sm:text-6xl lg:text-[3.25rem] xl:text-[4rem]">For Modern You</span>
            </h1>
            <p className="hero-rise mt-3 max-w-sm text-sm leading-relaxed tracking-[0.03em] text-white/85 lg:mt-5 lg:text-base" style={{ '--rise-delay': '500ms' } as React.CSSProperties}>Discover a fragrance that expresses your individuality.</p>
            <div className="hero-rise mt-5 flex flex-col gap-3 sm:flex-row lg:mt-9" style={{ '--rise-delay': '650ms' } as React.CSSProperties}>
              <ButtonLink href="/shop" size="lg" className="w-full bg-white! text-fg! hover:bg-white/90! sm:w-auto">
                Explore fragrances
              </ButtonLink>
              <ButtonLink href="/our-story" size="lg" className="border! border-white/70! bg-transparent! text-white! hover:bg-white/10! max-lg:hidden!">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
        <a href="#collections" aria-label="Scroll to the collections" className="hero-scroll absolute bottom-6 left-1/2 z-20 hidden h-12 w-6 -translate-x-1/2 justify-center lg:flex">
          <span aria-hidden className="hero-scroll-line block h-full w-px bg-white/25" />
        </a>
      </section>

      {/* Collections: three photos side by side on laptops, numbered like chapters. */}
      <section id="collections" className="scroll-mt-20 bg-surface">
        <Container className="py-14 md:py-24">
          <div data-reveal className="max-w-3xl">
            <p className="eyebrow">The collections</p>
            <h2 className="heading mt-2 text-fg">
              Three ways to wear <br className="md:hidden" />
              Ayyara
            </h2>
          </div>
          <ul data-reveal-stagger className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:mt-12 lg:grid-cols-3">
            {collections.map((collection) => (
              <li key={collection.number}>
                <Link href={collection.href} className="group flex h-full flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                    <Image src={collection.photo.src} alt={collection.photo.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" quality={85} placeholder="blur" className={`object-cover ${collection.photo.position} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]`} />
                  </div>
                  <div className="mt-4 flex items-baseline gap-3 sm:gap-4">
                    <span className="text-xs tracking-[0.14em] text-gold tabular-nums">{collection.number}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg leading-tight tracking-[0.02em] whitespace-nowrap text-fg min-[400px]:text-xl md:text-2xl lg:text-xl">{collection.title}</h3>
                      <p className="mt-1 text-xs text-mute text-nowrap">{collection.line}</p>
                    </div>
                    <span className={`${exploreLink} shrink-0 gap-1.5! text-[0.625rem]! lg:hidden! xl:inline-flex!`}>
                      <span className="border-b border-fg pb-0.5">Explore</span>
                      <Icon name="arrowRight" strokeWidth={1.5} className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Best sellers: a heading row above the product tiles. */}
      <section>
        <Container className="py-14 md:py-24">
          <div data-reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Most loved</p>
              <h2 className="heading mt-2 text-fg">The best sellers</h2>
              <p className="lede mt-3 max-w-md leading-relaxed text-mute">The fragrances our customers return to.</p>
            </div>
            <Link href="/shop" className={`${exploreLink} w-fit shrink-0 border-b border-fg pb-0.5`}>
              Shop all perfumes
            </Link>
          </div>
          {bestSellers.length === 0 ? (
            <p className="mt-10 border border-line p-10 text-center text-sm text-mute">The collection is being restocked. Please check back soon.</p>
          ) : (
            <BestSellerSlider data-reveal style={{ '--reveal-delay': '150ms' } as CSSProperties} className="mt-8 md:mt-12">
              {bestSellers.map((listing) => (
                <ProductCard key={listing.variant.id} listing={listing} />
              ))}
            </BestSellerSlider>
          )}
        </Container>
      </section>

      {/* Fragrance profile: how much perfume oil an Ayyara perfume holds, beside the shop's own comparison image. */}
      <section className="bg-surface">
        <Container className="grid grid-cols-1 items-center gap-8 py-14 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div data-reveal className="lg:col-span-6">
            <p className="eyebrow">Fragrance profile</p>
            <h2 className="heading mt-2 text-fg">{CONCENTRATION}</h2>
            <p className="lede mt-3 max-w-sm leading-relaxed text-mute">Every Ayyara perfume is made with <span className="whitespace-nowrap">40–50%</span> perfume oil, more than an eau de toilette, an eau de parfum or a parfum.</p>
            <Link href="/shop" className={`${exploreLink} mt-6 border-b border-fg pb-0.5`}>
              Explore fragrances
            </Link>
          </div>
          <Image
            src={oilConcentration}
            alt="Four bottles compared by perfume oil: Eau de toilette 5–15% oil, Eau de Parfum 15–20%, Parfum 20–30%, and Ayyara Perfume 40–50%"
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 448px, 100vw"
            placeholder="blur"
            data-reveal
            style={{ '--reveal-delay': '150ms' } as CSSProperties}
            className="mx-auto h-auto w-full max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none"
          />
        </Container>
      </section>

      {/*
       * The campaign films. Phone and tablet: a slider of portrait stills above the brand's own words.
       * Laptop: a standard section, the heading and words in a row on top, then the three films side by side.
       */}
      <section>
        <Container className="flex flex-col gap-8 py-14 md:py-24 lg:gap-12">
          <div data-reveal className="mx-auto w-full max-w-sm lg:hidden">
            {/* The bottles sit in the middle of the frame, so a shorter crop on phones keeps them whole. */}
            <FilmSlider films={films} frameClassName="aspect-[4/5] sm:aspect-[9/16]" />
          </div>
          <div data-reveal className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-6">
              <p className="eyebrow">The film</p>
              {/* One line at every width: the size follows the screen on phones and the column on laptops. */}
              <h2 className="mt-2 font-display text-[min(1.8rem,7.2vw)] tracking-[0.02em] text-nowrap text-fg md:text-5xl lg:text-[min(2.875rem,3.4vw)]">
                More Than a Fragrance
                <br />
                An Identity
              </h2>
              <p className="mt-1 text-sm tracking-[0.08em] text-mute">by Ayyara Rebirth</p>
            </div>
            <div className="lg:col-span-6 lg:pt-6">
              <p className="lede mt-5 max-w-md leading-relaxed text-mute lg:mt-0 lg:max-w-none">We believe a perfume is your invisible, unforgettable signature. Crafted to capture memories and evoke deep emotions, our collections bridge the gap between tradition and modern luxury. Step into our world and explore how our signature scents are born.</p>
              <Link href="/our-story" className={`${exploreLink} mt-7 border-b border-fg pb-0.5 lg:mt-5`}>
                Our story
              </Link>
            </div>
          </div>
          <FilmGrid films={films} frameClassName="aspect-[3/4]" className="hidden grid-cols-3 gap-8 lg:grid" />
        </Container>
      </section>

      {/* Three plain facts about every order. */}
      <section className="border-y border-line">
        <Container as="ul" data-reveal-stagger className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
        <div data-reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Stay in touch</p>
          <h2 className="heading mt-2 text-fg">Be first to know</h2>
          <p className="lede mt-3 leading-relaxed text-mute">New fragrances and offers, sent occasionally.</p>
          <div className="mt-7 text-left">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <ScrollReveal />

      {/* Who the shop is and the site itself, for search engines and AI answers. */}
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
    </>
  );
}
