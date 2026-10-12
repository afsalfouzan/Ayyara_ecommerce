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

const linkColumns = [
  { title: 'Pages', links: footerNav.pages },
  { title: 'Policies', links: footerNav.policies },
];

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0e0e0e] px-4 pt-16 pb-12 text-stone-300 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-3 md:gap-8">
          {linkColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="space-y-4">
              <h2 className="font-sans text-lg font-medium tracking-wide text-white">{column.title}</h2>
              <ul className="space-y-2.5 text-sm font-light text-stone-400">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="space-y-4">
            <h2 className="font-sans text-lg font-medium tracking-wide text-white">Contact Us</h2>
            <ul className="space-y-3 text-sm font-light text-stone-400">
              <li className="flex items-center space-x-3">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-stone-400" />
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-white">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-stone-400" />
                <a href={`mailto:${site.contact.email}`} className="break-all transition-colors hover:text-white">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Icon name="location" className="mt-1 h-4 w-4 shrink-0 text-stone-400" />
                <span className="leading-relaxed">{site.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center space-x-4 pb-8">
          {(Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).map((network) => (
            <a
              key={network}
              href={site.social[network]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on ${network === 'facebook' ? 'Facebook' : 'Instagram'}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-300 transition-colors hover:border-white hover:text-white"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d={SOCIAL_ICONS[network]} />
              </svg>
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-stone-400 sm:flex-row">
          <p className="text-center sm:text-left">
            © {year} {site.name}. All rights reserved.
          </p>
          <a href="#" aria-label="Scroll back to top" className="touch-ripple flex items-center justify-center rounded border border-stone-700 bg-stone-900 p-2.5 text-white transition-all hover:border-white">
            <Icon name="chevronUp" strokeWidth={2} className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
