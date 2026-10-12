'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { CartLink } from '@/components/cart/CartLink';
import { Icon } from '@/components/ui/icons';
import { mainNav } from '@/lib/site';
import { NavLink } from './NavLink';
import { SearchButton } from './SearchButton';

function RouteWatcher({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onNavigate();
  }, [pathname, onNavigate]);
  return null;
}

/** Site header: brand on the left (centred on phones), navigation in the middle, search / account / cart on the right. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const close = () => setOpen(false);

  // Close nav on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0e0e0e]/95 backdrop-blur-md">
      <Suspense fallback={null}>
        <RouteWatcher onNavigate={close} />
      </Suspense>
      {/* Phones: menu · logo (centred) · icons. Desktop: logo (left) · navigation (centred) · icons. */}
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:h-20">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="touch-ripple -ml-2 p-2 text-stone-300 hover:text-white focus:outline-none lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6 transition-transform duration-200" />
          </button>
          <Link href="/" aria-label="Ayyara Rebirth — home" className="hidden lg:inline-flex">
            <Logo variant="horizontal" />
          </Link>
        </div>

        <div className="flex justify-center">
          <Link href="/" aria-label="Ayyara Rebirth — home" className="inline-flex lg:hidden" onClick={close}>
            <Logo variant="horizontal" />
          </Link>
          <nav aria-label="Primary" className="hidden items-center space-x-8 text-sm font-normal tracking-wide lg:flex">
            {mainNav.map((item) =>
              'children' in item ? (
                // Opens on hover and on keyboard focus.
                <div key={item.label} className="group relative inline-flex cursor-pointer items-center">
                  <NavLink href={item.href} aria-haspopup="true" className="inline-flex items-center space-x-1 text-stone-300 transition-colors hover:text-white">
                    <span>{item.label}</span>
                    <Icon name="chevronDown" strokeWidth={2} className="mt-0.5 h-3.5 w-3.5 text-stone-400" />
                  </NavLink>
                  <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-5 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-44 border border-white/10 bg-[#141414] py-2 shadow-2xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block px-4 py-2 text-stone-300 transition-colors hover:text-white">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <NavLink key={item.href} href={item.href} className="text-stone-300 transition-colors hover:text-white">
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
        </div>

        {/* Right action icons */}
        <div className="flex items-center justify-end space-x-1 sm:space-x-3">
          <SearchButton />
          <Link href="/contact" aria-label="Customer care" className="touch-ripple hidden p-2 text-stone-300 transition-colors hover:text-white sm:inline-flex">
            <Icon name="user" className="h-5 w-5" />
          </Link>
          <CartLink />
        </div>
      </div>

      {/* Backdrop overlay — closes nav on click */}
      <div
        onClick={close}
        aria-hidden="true"
        className={clsx(
          'fixed inset-0 top-16 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Mobile drawer with smooth slide & fade animation */}
      <div
        id="mobile-drawer"
        aria-hidden={!open}
        // Closed menu links must not be reachable by keyboard or screen reader.
        inert={!open}
        className={clsx(
          'fixed top-16 left-0 right-0 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-white/10 bg-[#121212]/98 px-6 py-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out lg:hidden',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col space-y-4 text-sm font-light tracking-widest uppercase">
          {mainNav.map((item) =>
            'children' in item ? (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setProductsOpen((v) => !v)}
                  aria-expanded={productsOpen}
                  className="flex w-full items-center justify-between text-stone-300 uppercase transition-colors hover:text-white"
                >
                  <span>{item.label}</span>
                  <Icon
                    name="chevronDown"
                    strokeWidth={2}
                    className={clsx('h-4 w-4 text-stone-400 transition-transform duration-300', productsOpen && 'rotate-180')}
                  />
                </button>
                <div
                  className={clsx(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    productsOpen ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr] mt-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col space-y-3 border-l border-[#c5a059]/40 pl-4 py-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          href={child.href}
                          onClick={close}
                          className="text-stone-400 transition-colors hover:text-white"
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={close}
                className="text-stone-300 transition-colors hover:text-white"
                activeClassName="font-medium text-[#c5a059]"
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
