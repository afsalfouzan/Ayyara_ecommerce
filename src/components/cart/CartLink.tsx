'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icons';
import { useCart } from './cart-store';

export function CartLink() {
  const { count, ready } = useCart();
  const shown = ready ? count : 0;
  return (
    <Link href="/cart" aria-label={shown > 0 ? `Shopping cart, ${shown} item${shown === 1 ? '' : 's'}` : 'Shopping cart'} className="touch-ripple relative inline-flex items-center p-2 text-stone-300 transition-colors hover:text-white">
      <Icon name="cart" className="h-5 w-5" />
      <span aria-hidden className="absolute top-1 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-semibold text-white">
        {shown > 9 ? '9+' : shown}
      </span>
    </Link>
  );
}
