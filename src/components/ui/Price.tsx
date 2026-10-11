import { clsx } from 'clsx';
import { discountPercent, formatPrice } from '@/lib/format';
import type { Paise } from '@/lib/types';

/** Selling price, with MRP struck through and the saving when there is one. */
export function Price({
  price,
  mrp,
  from = false,
  showSaving = true,
  className,
}: {
  price: Paise;
  mrp?: Paise | null;
  from?: boolean;
  showSaving?: boolean;
  className?: string;
}) {
  const saving = mrp ? discountPercent(mrp, price) : 0;
  return (
    <span className={clsx('inline-flex flex-wrap items-baseline gap-x-2 tabular-nums', className)}>
      {from && <span className="text-[0.8em] text-mute">From</span>}
      <span>{formatPrice(price)}</span>
      {saving > 0 && (
        <>
          <span className="sr-only">, MRP</span>
          <s className="text-[0.85em] text-mute">{formatPrice(mrp!)}</s>
          {showSaving && <span className="text-[0.75em] font-medium tracking-wide text-gold-bright uppercase">{saving}% off</span>}
        </>
      )}
    </span>
  );
}
