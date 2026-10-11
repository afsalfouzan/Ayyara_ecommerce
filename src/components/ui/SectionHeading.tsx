import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  as: Heading = 'h2',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={clsx(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Heading className="text-4xl leading-[1.08] sm:text-5xl">{title}</Heading>
      {intro && <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">{intro}</p>}
    </div>
  );
}
