import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { collections, footerNav, site } from '@/lib/site';

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

const columns = [
  { title: 'Shop', links: [{ href: '/shop', label: 'All perfumes' }, ...collections.map((c) => ({ href: `/shop/${c.slug}`, label: c.title })), { href: '/offers', label: 'Offers' }] },
  { title: 'About', links: [{ href: '/our-story', label: 'Our story' }, { href: '/contact', label: 'Contact us' }] },
  { title: 'Help', links: footerNav.policies },
];

/** Footer: the brand and how to reach it, then three short columns of links. */
export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-16 lg:px-10">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" aria-label="Ayyara Rebirth — home" className="inline-flex">
            <Logo variant="horizontal" />
          </Link>
          <address className="mt-5 flex flex-col gap-1.5 text-sm text-fg-soft not-italic">
            <p className="max-w-xs">{site.contact.address}</p>
            <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="mt-1 w-fit text-fg hover:underline">
              {site.contact.phone}
            </a>
            <a href={`mailto:${site.contact.email}`} className="w-fit break-all text-fg hover:underline">
              {site.contact.email}
            </a>
          </address>
          <div className="mt-5 flex gap-3">
            {(Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).map((network) => (
              <a
                key={network}
                href={site.social[network]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on ${network === 'facebook' ? 'Facebook' : 'Instagram'}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas text-fg transition-colors hover:border-fg"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d={SOCIAL_ICONS[network]} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-xs font-medium tracking-[0.12em] text-fg uppercase">{column.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg-soft">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-fg hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-mute sm:px-6 lg:px-10">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
