import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { ListingCard } from '@/components/product/ListingCard';
import { bestSellerListings, getBestSellerIds, getProducts } from '@/lib/catalog';
import { imagery } from '@/lib/imagery';
import { collections } from '@/lib/site';
import { shareMeta } from '@/lib/seo';

/*
 * Home page, built to the design mock-up class for class. Tailwind 3 values the
 * design relied on (drop shadows, shadow-sm) are written out where Tailwind 4
 * differs. In Tailwind 3 a responsive text size also resets line height, so
 * those breakpoints carry an explicit sm:leading-* to render identically.
 */
export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: shareMeta('/') };

const dropShadowMd = '[filter:drop-shadow(0_4px_3px_rgb(0_0_0/0.07))_drop-shadow(0_2px_2px_rgb(0_0_0/0.06))]';
const dropShadow = '[filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.1))_drop-shadow(0_1px_1px_rgb(0_0_0/0.06))]';

export default async function HomePage() {
  const [products, rankedIds] = await Promise.all([getProducts(), getBestSellerIds()]);
  const bestSellers = bestSellerListings(products, rankedIds);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-black sm:min-h-[580px] md:min-h-[640px]">
        <div className="absolute inset-0 z-0">
          <Image src={imagery.hero.src} alt={imagery.hero.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="h-full w-full object-cover object-center brightness-[0.88]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20 text-center">
          <span className="mb-3 font-sans text-[11px] font-medium tracking-[0.3em] text-stone-300/80 uppercase">Maison De Parfum</span>
          <h1 className={`font-sans text-3xl font-light tracking-[0.18em] text-white uppercase sm:text-4xl md:text-5xl lg:text-6xl ${dropShadowMd}`}>FINE FRAGRANCES</h1>
          <p className={`mt-3 font-serif text-2xl font-normal tracking-wide text-stone-200 italic sm:text-3xl md:text-4xl ${dropShadow}`}>For modern you</p>
          <div className="mt-8">
            <Link href="/shop" className="touch-ripple inline-block rounded bg-white px-9 py-3.5 text-xs font-medium tracking-[0.24em] text-stone-900 uppercase shadow-xl transition-all hover:bg-stone-100 active:bg-stone-200 sm:text-sm">
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by gender */}
      <section className="bg-[#0e0e0e] px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center md:mb-14">
            <h2 className="font-serif text-3xl font-light tracking-wider text-white sm:text-4xl md:text-5xl">Shop By Gender</h2>
            <div className="mx-auto mt-4 h-[1px] w-12 bg-stone-700" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {collections.map((collection) => {
              const photo = imagery[collection.slug];
              return (
                <Link
                  key={collection.slug}
                  href={`/shop/${collection.slug}`}
                  className="group relative flex min-h-[420px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-stone-900 shadow-2xl sm:min-h-[460px]"
                >
                  <div className="absolute inset-0">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                  </div>
                  <div className="relative z-10 p-6 backdrop-blur-[2px] sm:p-8">
                    <span className="mb-1 block font-sans text-[10px] font-medium tracking-[0.25em] text-stone-400 uppercase">Collection</span>
                    <h3 className="mb-2 font-serif text-2xl font-light tracking-wide text-white sm:text-3xl">{collection.title}</h3>
                    <p className="text-sm leading-relaxed font-light text-stone-300">{collection.line}</p>
                    <p className="mt-1.5 text-xs font-light tracking-wide text-stone-400">{collection.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-[#e8e6e1] px-4 py-16 text-stone-900 sm:px-6 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-12">
          <div className="order-2 flex flex-col items-start justify-center pr-0 lg:order-1 lg:col-span-6 lg:pr-6">
            <h2 className="font-sans text-3xl leading-tight font-normal tracking-tight text-stone-950 sm:text-4xl sm:leading-10 md:text-5xl md:leading-none">
              More Than A Fragrance
              <br />
              An Identity
            </h2>
            <p className="mt-6 text-base leading-relaxed font-light text-stone-700 sm:text-lg sm:leading-7">
              We believe a perfume is your invisible, unforgettable signature. Crafted to capture memories and evoke deep emotions, our collections bridge the gap between tradition and modern luxury. Step into our world and explore how our
              signature scents are born
            </p>
            <div className="mt-8">
              <Link href="/our-story" className="touch-ripple inline-block rounded-full bg-black px-8 py-3.5 text-xs font-medium tracking-wider text-white uppercase shadow-md transition-all hover:bg-stone-800 sm:text-sm">
                Discover Our Story
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-300/40 bg-stone-200 shadow-2xl sm:aspect-[16/11]">
              <Image src={imagery.story.src} alt={imagery.story.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-[#ffffff] px-4 py-16 text-stone-900 sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="w-full lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-xl sm:aspect-[4/5] lg:aspect-auto lg:h-[580px]">
                <Image src={imagery.bestSellers.src} alt={imagery.bestSellers.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <h2 className="font-sans text-3xl font-semibold tracking-tight text-stone-950 uppercase sm:text-4xl md:text-5xl">BEST SELLERS</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed font-light text-stone-600 sm:text-base sm:leading-6">
                  We are crafting fragrances designed to leave a lasting impression. Leave your details below to stay updated on our upcoming launches, exclusive offers, and brand journey
                </p>
              </div>
              {bestSellers.length === 0 ? (
                <p className="mt-8 rounded-2xl border border-stone-200 p-10 text-center text-stone-600">The collection is being restocked. Please check back soon.</p>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {bestSellers.map((listing) => (
                    <ListingCard key={listing.variant.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-white/10 bg-[#0e0e0e] px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-sans text-2xl font-medium tracking-wider text-white uppercase sm:text-3xl">DISCOVER YOUR SIGNATURE</h2>
              <p className="mt-4 text-sm leading-relaxed font-light text-stone-400 sm:text-base sm:leading-6">
                We are crafting fragrances designed to leave a lasting impression. Leave your details below to stay updated on our upcoming launches, exclusive offers, and brand journey
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
