import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import discovery from '@/assets/shop/discovery.jpg';
import distillation from '@/assets/shop/distillation.jpg';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon, type IconName } from '@/components/ui/icons';
import { getBestSellerIds, type Listing } from '@/lib/catalog';
import { collections } from '@/lib/site';
import { CatalogListings } from './CatalogListings';

const TABS: { href: string; label: string; icon?: IconName }[] = [
  { href: '/shop', label: 'All perfumes' },
  ...collections.map((c) => ({ href: `/shop/${c.slug}`, label: c.label })),
  { href: '/offers', label: 'Offers', icon: 'gift' },
];

const promises: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: '100% Satisfaction', text: 'Guaranteed return' },
  { icon: 'drop', title: '28% Extrait', text: 'Pure oil potency' },
  { icon: 'truck', title: 'Insured Express', text: 'Pan-India delivery' },
];

/**
 * Shared layout for the shop, collection, offers and search pages, in the same
 * near-black and champagne style as the home page. The design was drawn for a
 * phone; on wider screens the product cards grow with the screen, while the
 * feature cards and the row of promises keep their phone size.
 */
export async function CatalogPage({ eyebrow, title, intro, listings, current, crumbs, empty, children }: { eyebrow: string; title: string; intro?: string; listings: Listing[]; current?: string; crumbs: { name: string; href: string }[]; empty: ReactNode; children?: ReactNode }) {
  const rankedIds = await getBestSellerIds();
  return (
    <div className="bg-[#131313] px-5 pt-4 pb-16 text-[#e5e2e1] sm:px-8 sm:pt-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, ...crumbs]} />

        <div className="mt-4 flex flex-col gap-1.5">
          <p className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#c8b69b]/25 bg-[#1c1a17]/90 px-2.5 py-0.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cbb596]" />
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#dfd5c4] uppercase">{eyebrow}</span>
          </p>
          <h1 className="font-playfair text-[28px] leading-9 tracking-tight text-[#f5f3ee] md:text-[40px] md:leading-[48px]">{title}</h1>
          {intro && <p className="max-w-sm text-[13px] leading-relaxed text-[#beb6a8] md:max-w-xl md:text-[15px]">{intro}</p>}
        </div>

        {children}

        {current !== undefined && (
          <nav aria-label="Collections" className="-mx-5 mt-5 overflow-x-auto [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden">
            <ul className="flex min-w-max items-center gap-1.5 px-5 sm:px-0">
              {TABS.map((tab) => {
                const active = current === tab.href;
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      aria-current={active ? 'page' : undefined}
                      className={clsx(
                        'flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] tracking-widest whitespace-nowrap uppercase transition-all',
                        active ? 'bg-gradient-to-r from-[#cbb596] to-[#bfa886] font-semibold text-[#151311] shadow-md' : 'border border-white/[0.08] bg-[#191816] font-semibold text-[#cec5b9] hover:border-[#c8b69b]/30 hover:text-white',
                      )}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-[#151311]" />}
                      {tab.icon && !active && <Icon name={tab.icon} strokeWidth={1.8} className="h-3.5 w-3.5 text-[#cbb596]" />}
                      <span>{tab.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <CatalogListings listings={listings} rankedIds={rankedIds} empty={empty} />

        {/* What comes with every order, and how the perfumes are made */}
        <div className="mt-10 flex flex-wrap items-stretch justify-center gap-4">
          <section className="relative w-full max-w-[350px] overflow-hidden rounded-xl border border-[#c8b69b]/20 bg-[#161514] p-4">
            <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#c8b69b]/10 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0e0e0e]">
                <Image src={discovery} alt="A gift box holding three small Ayyara Rebirth bottles" fill sizes="192px" quality={85} placeholder="blur" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-[#cbb596] uppercase">
                  <Icon name="sparkle" strokeWidth={2} className="h-4 w-4" />
                  Complimentary Gift
                </p>
                <h2 className="font-playfair text-[19px] leading-tight font-medium text-[#f5f3ee]">The Discovery Ritual</h2>
                <p className="text-xs leading-snug text-[#beb6a8]">Receive a complimentary 2ml discovery vial with every full flacon order. Experience the scent skin-first before breaking the wax seal.</p>
              </div>
            </div>
          </section>

          <section className="relative flex w-full max-w-[350px] flex-col gap-2 overflow-hidden rounded-xl border border-[#c8b69b]/20 bg-[#161514] p-4">
            <div className="relative h-36 w-full overflow-hidden rounded-lg bg-[#0e0e0e]">
              {/* A wide band of a square photo, drawn at the card's full width. */}
              <Image src={distillation} alt="A copper still among glass bottles, spices and dried flowers by a window" fill sizes="(min-width: 400px) 640px, 180vw" quality={85} placeholder="blur" className="h-full w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161514] via-[#161514]/30 to-transparent" />
              <p className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full border border-[#c8b69b]/25 bg-[#181715]/90 px-2 py-0.5 backdrop-blur-md">
                <Icon name="flask" strokeWidth={2} className="h-3.5 w-3.5 text-[#cbb596]" />
                <span className="text-[9px] font-semibold tracking-wider text-[#dfd5c4] uppercase">Kerala Botanical Atelier</span>
              </p>
            </div>
            <div>
              <h2 className="font-playfair text-[17px] font-medium text-[#f5f3ee]">Pure Distillation Alchemy</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#beb6a8]">Crafted with 28% pure perfume oils, slow-macerated for 45 days in copper vessels to unlock hypnotic longevity and unmatched sillage.</p>
            </div>
          </section>
        </div>

        <ul className="mx-auto mt-8 grid w-full max-w-[350px] grid-cols-3 gap-1 rounded-xl border border-white/[0.06] bg-[#141312] p-2">
          {promises.map((promise) => (
            <li key={promise.title} className="flex flex-col items-center gap-1 p-1 text-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c8b69b]/20 bg-[#1c1a18] text-[#cbb596]">
                <Icon name={promise.icon} strokeWidth={1.8} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#f5f3ee] uppercase">{promise.title}</span>
              <span className="text-[10px] leading-tight text-[#beb6a8]">{promise.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EmptyMessage({ title, body }: { title: string; body: ReactNode }) {
  return (
    <>
      <p className="font-playfair text-2xl text-[#f5f3ee]">{title}</p>
      <p className="mt-3 text-sm text-[#beb6a8]">{body}</p>
    </>
  );
}
