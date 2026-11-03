'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, type ReactNode } from 'react';

/** How far below the top of the screen a short panel sits (clear of the 5rem header), in pixels. */
const TOP = 112;
const BOTTOM_GAP = 24;

/**
 * The details beside the photos on laptops: it stays in view while the photos scroll past. A panel taller than
 * the screen would be cut off at the bottom, so it is allowed to scroll up until its last line is in view and
 * then holds there. It ends with the photos and never reaches the footer.
 */
export function StickyPanel({ children, className }: { children: ReactNode; className?: string }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const place = () => {
      element.style.top = `${Math.min(TOP, window.innerHeight - element.offsetHeight - BOTTOM_GAP)}px`;
    };
    place();
    const watcher = new ResizeObserver(place);
    watcher.observe(element);
    window.addEventListener('resize', place);
    return () => {
      watcher.disconnect();
      window.removeEventListener('resize', place);
    };
  }, []);

  return (
    <div ref={panel} className={clsx('lg:sticky lg:top-28 lg:self-start', className)}>
      {children}
    </div>
  );
}
