import { clsx } from 'clsx';
import { LOGO_FULL, LOGO_MARK, LOGO_REBIRTH, LOGO_WORDMARK } from './logo-paths';

function Shape({ shape, className }: { shape: { viewBox: string; d: string }; className?: string }) {
  return (
    <svg viewBox={shape.viewBox} className={clsx('w-auto shrink-0', className)} aria-hidden>
      <path fill="currentColor" fillRule="evenodd" d={shape.d} />
    </svg>
  );
}

/**
 * Official Ayyara Rebirth logo (vector, traced from the brand artwork).
 * - `wordmark`: AYYARA with "Rebirth" beneath, for the header and menus.
 * - `full`: the stacked logo with the AB monogram, for the footer and hero spots.
 */
export function Logo({ className, variant = 'wordmark' }: { className?: string; variant?: 'wordmark' | 'full' }) {
  return (
    <span role="img" aria-label="Ayyara Rebirth" className={clsx('inline-flex flex-col items-center leading-none select-none', 'text-fg', className)}>
      {variant === 'full' ? (
        <Shape shape={LOGO_FULL} className="h-24 sm:h-28" />
      ) : (
        <>
          <Shape shape={LOGO_WORDMARK} className="h-[1.3rem] md:h-[1.55rem]" />
          <Shape shape={LOGO_REBIRTH} className="mt-1 h-[0.55rem] md:h-[0.6rem]" />
        </>
      )}
    </span>
  );
}

/** The AB monogram alone, for tight spaces. */
export function Monogram({ className }: { className?: string }) {
  return <Shape shape={LOGO_MARK} className={className} />;
}
