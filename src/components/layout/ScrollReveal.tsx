'use client';

import { useEffect } from 'react';

/**
 * Fades in everything marked `data-reveal` the first time it scrolls into view;
 * the children of `data-reveal-stagger` follow one another. The hiding itself is
 * CSS (see globals.css), switched on by a small script in the layout before the
 * page paints, so nothing flickers.
 *
 * Put it at the end of a page, not in the layout: its effect then runs only once
 * that page has finished hydrating. React rejects any attribute added to an
 * element it hasn't hydrated yet, which is what happens if this starts earlier
 * and the shopper scrolls while the page is still loading.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('reveal-ready');
    if (!root.classList.contains('js-reveal')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    document.querySelectorAll('[data-reveal]:not([data-revealed]), [data-reveal-stagger]:not([data-revealed])').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
