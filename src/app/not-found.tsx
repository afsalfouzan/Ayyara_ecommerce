import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { collections } from '@/lib/site';

export const metadata: Metadata = { title: 'Page not found' };

/** Shown for any address the shop doesn't have, with a 404 status. Points to the collections so the visit can carry on. */
export default function NotFound() {
  return (
    <Container size="narrow" className="py-24 text-center sm:py-32">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl text-fg md:text-6xl">We can’t find that page</h1>
      <p className="mt-5 text-mute">The page you are looking for may have moved or no longer exists.</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop">Shop all perfumes</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Return home
        </ButtonLink>
      </div>
      <nav aria-labelledby="not-found-collections" className="mt-14 border-t border-line pt-10">
        <h2 id="not-found-collections" className="eyebrow">
          Browse the collections
        </h2>
        <ul className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[...collections.map((collection) => ({ href: `/shop/${collection.slug}`, label: collection.title })), { href: '/offers', label: 'Offers' }].map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium tracking-[0.12em] text-fg uppercase underline-offset-4 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
