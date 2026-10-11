'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { CartLink } from '@/components/cart/CartLink';
import { Icon } from '@/components/ui/icons';
import { mainNav } from '@/lib/site';
import { NavLink } from './NavLink';
import { SearchButton } from './SearchButton';

/** Site header, matching the design: left nav, centred brand, search / account / cart on the right. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0e0e0e]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Mobile menu & left nav links */}
        <div className="flex items-center space-x-3 lg:space-x-6">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation menu" aria-expanded={open} aria-controls="mobile-drawer" className="touch-ripple p-2 text-stone-300 hover:text-white focus:outline-none lg:hidden">
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
          <nav aria-label="Primary" className="hidden items-center space-x-6 text-sm font-normal tracking-wide lg:flex">
            {mainNav.map((item) =>
              'children' in item ? (
                // Opens on hover and on keyboard focus.
                <div key={item.label} className="group relative inline-flex cursor-pointer items-center">
                  <NavLink href={item.href} aria-haspopup="true" className="inline-flex items-center space-x-1 text-stone-300 transition-colors hover:text-white">
                    <span>{item.label}</span>
                    <Icon name="chevronDown" strokeWidth={2} className="mt-0.5 h-3.5 w-3.5 text-stone-400" />
                  </NavLink>
                  <div className="invisible absolute top-full left-0 z-50 pt-4 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
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

        {/* Centre brand */}
        <div className="flex cursor-pointer flex-col items-center justify-center text-center select-none">
          <Link href="/" aria-label="Ayyara Rebirth — home" className="inline-block text-center leading-tight" onClick={close}>
            <Logo />
          </Link>
        </div>

        {/* Right action icons */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <SearchButton />
          <Link href="/contact" aria-label="Customer care" className="touch-ripple p-2 text-stone-300 transition-colors hover:text-white">
            <Icon name="user" className="h-5 w-5" />
          </Link>
          <CartLink />
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-drawer" className={clsx('border-b border-white/10 bg-[#141414] px-6 py-5 transition-all lg:hidden', !open && 'hidden')}>
        <nav aria-label="Mobile" className="flex flex-col space-y-4 text-sm font-light tracking-widest uppercase">
          {mainNav.map((item) =>
            'children' in item ? (
              <div key={item.label}>
                <button type="button" onClick={() => setProductsOpen((v) => !v)} aria-expanded={productsOpen} className="flex w-full items-center justify-between text-stone-300 uppercase hover:text-white">
                  <span>{item.label}</span>
                  <Icon name="chevronDown" strokeWidth={2} className={clsx('h-4 w-4 text-stone-400 transition-transform', productsOpen && 'rotate-180')} />
                </button>
                {productsOpen && (
                  <div className="mt-4 flex flex-col space-y-3 border-l border-white/10 pl-4">
                    {item.children.map((child) => (
                      <NavLink key={child.href} href={child.href} onClick={close} className="text-stone-400 transition-colors hover:text-white">
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.href} href={item.href} onClick={close} className="text-stone-300 transition-colors hover:text-white" activeClassName="font-medium">
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
