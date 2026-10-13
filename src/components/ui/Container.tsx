import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: 'default' | 'narrow' | 'wide';
} & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = 'div'>({
  as,
  size = 'default',
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? 'div';
  return (
    <Component
      className={clsx(
        'mx-auto w-full px-5 sm:px-8 lg:px-12',
        size === 'narrow' && 'max-w-3xl',
        size === 'default' && 'max-w-7xl',
        size === 'wide' && 'max-w-[1600px]',
        className,
      )}
      {...props}
    />
  );
}
