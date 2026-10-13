import { clsx } from 'clsx';

/**
 * The shop's name in type, used in the header and footer in place of the logo
 * artwork: AYYARA in the serif, with REBIRTH small and widely spaced beneath.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex flex-col items-center leading-none text-fg select-none', className)}>
      <span className="font-display text-[1.375rem] leading-none font-semibold tracking-[0.2em] uppercase sm:text-2xl">Ayyara</span>
      <span className="mt-1 pl-[0.42em] text-[0.5625rem] leading-none font-medium tracking-[0.42em] uppercase">Rebirth</span>
    </span>
  );
}
