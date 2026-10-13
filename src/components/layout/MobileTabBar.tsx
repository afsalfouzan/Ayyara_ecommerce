'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { useCart } from '@/components/cart/cart-store';
import { Icon, type IconName } from '@/components/ui/icons';

const tabs: { href: string; label: string; icon: IconName; matches: (path: string) => boolean }[] = [
  { href: '/', label: 'Maison', icon: 'home', matches: (path) => path === '/' },
  // The three collections on the home page.
  { href: '/#collections', label: 'Series', icon: 'sparkle', matches: () => false },
  { href: '/shop', label: 'Scents', icon: 'flower', matches: (path) => path.startsWith('/shop') || path.startsWith('/products') },
  { href: '/cart', label: 'Bag', icon: 'bag', matches: (path) => path.startsWith('/cart') || path.startsWith('/checkout') },
];

/**
 * The bar of four shortcuts fixed to the bottom of the screen on phones, as in
 * the home page design. It is hidden from tablets up, where the header's menu
 * is always in view. The bar itself is part of the prerendered page; which tab
 * is lit, and the bag count, fill in once the address and the bag are known.
 */
export function MobileTabBar() {
  return (
    <nav aria-label="Shortcuts" className="fixed inset-x-0 bottom-0 z-40 bg-[#0e0e0e]/90 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl md:hidden">
      <Suspense fallback={<Tabs path={null} />}>
        <CurrentTabs />
      </Suspense>
    </nav>
  );
}

function CurrentTabs() {
  return <Tabs path={usePathname()} />;
}

function Tabs({ path }: { path: string | null }) {
  const { count, ready } = useCart();
  const inBag = ready ? count : 0;
  return (
    <ul className="flex h-16 items-center justify-around px-2">
      {tabs.map((tab) => {
        const active = path != null && tab.matches(path);
        return (
          <li key={tab.label}>
            <Link
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              aria-label={tab.label === 'Bag' ? `Bag, ${inBag} item${inBag === 1 ? '' : 's'}` : undefined}
              className={clsx('relative flex h-12 w-16 flex-col items-center justify-center transition-colors duration-200', active ? 'text-champagne' : 'text-mist hover:text-white')}
            >
              <Icon name={tab.icon} strokeWidth={1.6} className="h-[22px] w-[22px]" />
              <span className="mt-1 text-[10px] font-semibold tracking-widest uppercase">{tab.label}</span>
              {tab.label === 'Bag' && inBag > 0 && (
                <span aria-hidden className="absolute top-0 right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-bold text-ink">
                  {inBag > 9 ? '9+' : inBag}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
