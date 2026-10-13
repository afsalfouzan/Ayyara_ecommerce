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
 * - `horizontal`: AB monogram beside AYYARA / Rebirth — the header lockup.
 * - `wordmark`: AYYARA with "Rebirth" beneath, for tight spaces.
 * - `full`: the stacked logo with the AB monogram, for the footer and hero spots.
 */
export function Logo({ className, variant = 'wordmark' }: { className?: string; variant?: 'horizontal' | 'wordmark' | 'full' }) {
  if (variant === 'horizontal') {
    return (
      <span role="img" aria-label="Ayyara Rebirth" className={clsx('inline-flex items-center gap-2.5 sm:gap-3 leading-none text-fg select-none', className)}>
        <Shape shape={LOGO_MARK} className="h-6 sm:h-7 lg:h-7.5" />
        <span className="flex flex-col items-center">
          <Shape shape={LOGO_WORDMARK} className="h-[0.72rem] sm:h-[0.82rem] lg:h-[0.88rem]" />
          <Shape shape={LOGO_REBIRTH} className="mt-0.5 h-[0.34rem] sm:h-[0.38rem] lg:h-[0.42rem]" />
        </span>
      </span>
    );
  }
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
