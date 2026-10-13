'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icons';
import { useCart } from './cart-store';

export function CartLink() {
  const { count, ready } = useCart();
  const shown = ready ? count : 0;
  return (
    <Link href="/cart" aria-label={`Shopping cart, ${shown} item${shown === 1 ? '' : 's'}`} className="relative inline-flex items-center p-2 text-fg transition-colors hover:text-gold">
      <Icon name="bag" strokeWidth={1.6} className="h-[22px] w-[22px]" />
      <span aria-hidden className="absolute top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fg px-1 text-[10px] font-semibold text-canvas">
        {shown > 9 ? '9+' : shown}
      </span>
    </Link>
  );
}
