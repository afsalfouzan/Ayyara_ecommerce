import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Icon } from '@/components/ui/icons';
import { footerNav, site } from '@/lib/site';

async function currentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

const SOCIAL_ICONS = {
  facebook: 'M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.597 0 9 1.582 9 4.615V8z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
} as const;

const footerLinks = [...footerNav.pages, ...footerNav.policies];

/** Footer in the home page's style: the house name, where to find us, one rail of links. */
export async function SiteFooter() {
  const year = await currentYear();
  // "Veliyamthode, Chandakunnu, Malappuram, Kerala 679329, India" reads better as a name and a line beneath it.
  const [place, ...rest] = site.contact.address.split(', ');
  return (
    <footer className="mt-auto flex flex-col items-center border-t border-white/5 bg-[#0e0e0e] px-5 pt-10 pb-8 text-center sm:px-8 md:pt-14">
      <div className="flex flex-col items-center">
        <span className="font-playfair text-2xl font-medium tracking-[0.25em] text-white uppercase">Ayyara</span>
        <span className="mt-0.5 text-[9px] font-semibold tracking-[0.4em] text-champagne uppercase">Rebirth // Atelier</span>
      </div>
      <div className="my-6 h-px w-10 bg-[#4e483f]" />

      <address className="flex flex-col gap-2 text-[13px] text-mist not-italic">
        <p className="font-medium text-[#eae1d5]">{place}</p>
        <p>{rest.join(', ')}</p>
        <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="mt-1 font-medium tracking-wide text-white transition-colors hover:text-champagne">
          {site.contact.phone}
        </a>
        <a href={`mailto:${site.contact.email}`} className="text-xs break-all text-sand transition-colors hover:text-white">
          {site.contact.email}
        </a>
      </address>

      <nav aria-label="Footer" className="mt-8">
        <ul className="flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-semibold tracking-wider text-sand uppercase">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 flex justify-center gap-4">
        {(Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).map((network) => (
          <a
            key={network}
            href={site.social[network]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on ${network === 'facebook' ? 'Facebook' : 'Instagram'}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#444845] text-sand transition-colors hover:border-champagne hover:text-champagne"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
              <path d={SOCIAL_ICONS[network]} />
            </svg>
          </a>
        ))}
        <a href="#" aria-label="Scroll back to top" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#444845] text-sand transition-colors hover:border-champagne hover:text-champagne">
          <Icon name="chevronUp" strokeWidth={2} className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-1 pt-6 text-[11px] text-[#8e918f]">
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
        <p className="text-[10px] text-[#6b6f6c]">Haute Parfumerie Artisans • Made in Kerala</p>
      </div>
    </footer>
  );
}
