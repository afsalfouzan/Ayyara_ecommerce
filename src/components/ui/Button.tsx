import { clsx } from 'clsx';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[2px] text-xs font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary: 'bg-fg text-white hover:bg-fg-soft',
  outline: 'border border-fg text-fg hover:bg-fg hover:text-white',
  ghost: 'text-fg underline underline-offset-4 hover:text-gold',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4',
  md: 'h-11 px-6',
  lg: 'h-12 px-8',
};

export function buttonClasses({ variant = 'primary', size = 'md', className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return clsx(base, variants[variant], variant !== 'ghost' && sizes[size], className);
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
