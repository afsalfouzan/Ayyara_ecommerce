'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, type ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<typeof Link> & { href: string; activeClassName?: string };

/**
 * Navigation link that marks the current page with an underline.
 * The plain link is part of the prerendered shell; the active state streams in
 * once the URL is known, so the header never blocks static rendering.
 */
export function NavLink({ activeClassName, ...props }: Props) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <ActiveLink activeClassName={activeClassName} {...props} />
    </Suspense>
  );
}

function ActiveLink({ href, className, activeClassName, ...props }: Props) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
  return <Link href={href} aria-current={active ? 'page' : undefined} className={clsx(className, active && ['text-fg! underline decoration-1 underline-offset-8', activeClassName])} {...props} />;
}
