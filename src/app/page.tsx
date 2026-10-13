import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { ProductCard } from '@/components/product/ProductCard';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon, type IconName } from '@/components/ui/icons';
import { bestSellerListings, getBestSellerIds, getProducts } from '@/lib/catalog';
import { imagery } from '@/lib/imagery';
import { shareMeta } from '@/lib/seo';
import { collections, site } from '@/lib/site';

/*
 * Home page: a hero, the three collections, the best sellers, a short brand
 * note, what every order comes with, and the sign-up. Light and quiet, with the
 * photography carrying the colour.
 */
export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: shareMeta('/') };

/** What is true of every order, taken from the shop's own policies. */
const services: { icon: IconName; title: string; text: string }[] = [
  { icon: 'truck', title: 'Free delivery', text: `Across India, in ${site.policies.deliveryWindow.replace(' across India', '')}.` },
  { icon: 'returnArrow', title: `${site.policies.returnWindowDays}-day returns`, text: 'On unopened products.' },
  { icon: 'lock', title: 'Secure payment', text: 'UPI, cards and net banking.' },
];

export default async function HomePage() {
  const [products, rankedIds] = await Promise.all([getProducts(), getBestSellerIds()]);
  const bestSellers = bestSellerListings(products, rankedIds);

  return (
    <>
      {/* Hero: words on ivory beside the photo; on a phone the photo comes first. */}
      <section>
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:order-2 lg:aspect-auto lg:min-h-[600px]">
            {/* A wide crop of a square photo on phones; about half the screen on a laptop. */}
            <Image src={imagery.hero.src} alt={imagery.hero.alt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 60vw, 100vw" quality={85} placeholder="blur" className="object-cover" />
          </div>
          <div className="flex flex-col items-start justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
            <p className="eyebrow">{site.name}</p>
            <h1 className="mt-3 text-[2.75rem] text-fg sm:text-6xl lg:text-7xl">
              Fine Fragrances
              <br />
              for the Modern You
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">Refined fragrances for those who make scent their signature. Discover the one that feels uniquely yours.</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/shop" size="lg">
                Shop perfumes
              </ButtonLink>
              <ButtonLink href="/our-story" variant="ghost">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <Container as="section" id="collections" className="scroll-mt-20 py-12 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="mt-2 font-display text-3xl text-fg md:text-4xl">Find your signature</h2>
          </div>
          <Link href="/shop" className="shrink-0 text-xs font-medium tracking-[0.12em] text-fg uppercase underline underline-offset-4 hover:text-gold">
            View all
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-3 md:mt-8">
          {collections.map((collection) => {
            const photo = imagery[collection.slug];
            return (
              <li key={collection.slug}>
                <Link href={`/shop/${collection.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface sm:aspect-[4/5]">
                    {/* A tall crop of a 4:3 photo from tablets up, so it needs about 1.7 times its own width in pixels. */}
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 56vw, 100vw" quality={85} placeholder="blur" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-medium tracking-normal text-fg md:text-lg">{collection.title}</h3>
                      <p className="mt-0.5 text-sm text-mute">{collection.line}</p>
                    </div>
                    <Icon name="arrowRight" strokeWidth={1.6} className="h-5 w-5 shrink-0 text-fg transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>

      {/* Best sellers */}
      <section className="bg-surface">
        <Container className="py-12 md:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Most loved</p>
              <h2 className="mt-2 font-display text-3xl text-fg md:text-4xl">Best sellers</h2>
            </div>
            <Link href="/shop" className="shrink-0 text-xs font-medium tracking-[0.12em] text-fg uppercase underline underline-offset-4 hover:text-gold">
              Shop all
            </Link>
          </div>
          {bestSellers.length === 0 ? (
            <p className="mt-8 border border-line bg-canvas p-10 text-center text-sm text-mute">The collection is being restocked. Please check back soon.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:mt-8 md:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((listing, index) => (
                <li key={listing.variant.id} className="bg-canvas p-3 sm:p-4">
                  <ProductCard listing={listing} priority={index === 0} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* A short note about the house */}
      <Container as="section" className="py-14 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-2 font-display text-3xl text-fg md:text-5xl">More than a fragrance, an identity</h2>
          <p className="mt-4 text-base leading-relaxed text-fg-soft md:text-lg">We believe a perfume is your invisible, unforgettable signature. Each fragrance is crafted to capture memories and stir emotion, bridging tradition and modern luxury.</p>
          <ButtonLink href="/our-story" variant="outline" className="mt-7">
            Discover our story
          </ButtonLink>
        </div>
      </Container>

      {/* What every order comes with */}
      <section className="border-y border-line">
        <Container as="ul" className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3 md:py-10">
          {services.map((service) => (
            <li key={service.title} className="flex items-start gap-3">
              <Icon name={service.icon} strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-fg" />
              <div>
                <p className="text-sm font-medium text-fg">{service.title}</p>
                <p className="mt-0.5 text-sm text-mute">{service.text}</p>
              </div>
            </li>
          ))}
        </Container>
      </section>

      {/* Sign-up */}
      <Container as="section" className="grid grid-cols-1 gap-6 py-12 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-md">
          <p className="eyebrow">Stay updated</p>
          <h2 className="mt-2 font-display text-3xl text-fg md:text-4xl">New launches and offers, first</h2>
          <p className="mt-3 text-base leading-relaxed text-fg-soft">Leave your details and we’ll write when a new fragrance arrives or an offer opens.</p>
        </div>
        <div className="max-w-lg lg:pt-2">
          <NewsletterForm />
        </div>
      </Container>
    </>
  );
}
