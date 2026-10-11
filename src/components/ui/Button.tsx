import { clsx } from 'clsx';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'gold';
type Size = 'md' | 'lg';

const base =
  'label inline-flex items-center justify-center gap-2.5 rounded-[2px] transition-[background-color,color,border-color,opacity] duration-300 ease-luxe disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary: 'bg-fg text-canvas hover:bg-fg-soft',
  outline: 'border border-fg text-fg hover:bg-fg hover:text-canvas',
  ghost: 'text-fg hover:text-gold-bright',
  gold: 'bg-gold text-fg hover:bg-gold-bright hover:text-canvas',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-6',
  lg: 'h-13 px-8 sm:px-10',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return clsx(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
