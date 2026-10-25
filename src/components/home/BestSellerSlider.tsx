'use client';

import { Children, type CSSProperties, type ReactNode } from 'react';
import { InfiniteBelt } from './InfiniteBelt';

/**
 * The best sellers. On phones and tablets they sit on a belt that keeps moving left and can be swiped either way:
 * two cards in view on small phones, three on large phones and four on tablets.
 * On laptops (lg and up) they are simply listed, each perfume once, five to a row, starting from the left.
 */
export function BestSellerSlider({ children, className = '', style, 'data-reveal': reveal }: { children: ReactNode; className?: string; style?: CSSProperties; 'data-reveal'?: boolean }) {
  const slides = Children.toArray(children);
  return (
    <div data-reveal={reveal || undefined} style={style} className={className}>
      <InfiniteBelt
        label="Best sellers"
        count={slides.length}
        className="lg:hidden"
        renderCopy={(copy) =>
          slides.map((slide, index) => (
            <li key={`${copy}-${index}`} className="mr-5 w-[calc((100cqw-1.25rem)/2)] shrink-0 sm:mr-6 sm:w-[calc((100cqw-3rem)/3)] md:w-[calc((100cqw-4.5rem)/4)] sm:[&_h3]:text-lg">
              {slide}
            </li>
          ))
        }
      />
      <ul aria-label="Best sellers" className="hidden flex-wrap gap-6 lg:flex">
        {slides.map((slide, index) => (
          <li key={index} className="w-[calc((100%-6rem)/5)] [&_h3]:text-lg">
            {slide}
          </li>
        ))}
      </ul>
    </div>
  );
}
