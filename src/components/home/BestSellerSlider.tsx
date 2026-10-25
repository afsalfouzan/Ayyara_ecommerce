'use client';

import { Children, type CSSProperties, type ReactNode } from 'react';
import { InfiniteBelt } from './InfiniteBelt';

/**
 * The best sellers on a belt that keeps moving left and can be swiped either way.
 * Two cards are in view on small phones, three on large phones, four on tablets and five on laptops; the belt spans the full page width.
 */
export function BestSellerSlider({ children, className = '', style, 'data-reveal': reveal }: { children: ReactNode; className?: string; style?: CSSProperties; 'data-reveal'?: boolean }) {
  const slides = Children.toArray(children);
  return (
    <InfiniteBelt
      label="Best sellers"
      count={slides.length}
      className={className}
      style={style}
      reveal={reveal}
      renderCopy={(copy) =>
        slides.map((slide, index) => (
          <li key={`${copy}-${index}`} className="mr-5 w-[calc((100cqw-1.25rem)/2)] shrink-0 sm:mr-6 sm:w-[calc((100cqw-3rem)/3)] md:w-[calc((100cqw-4.5rem)/4)] lg:w-[calc((100cqw-6rem)/5)] sm:[&_h3]:text-lg">

            {slide}
          </li>
        ))
      }
    />
  );
}
