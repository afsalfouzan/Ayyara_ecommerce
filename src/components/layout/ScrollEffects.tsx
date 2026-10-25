'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

/**
 * Gliding scroll for the whole site: a mouse wheel or trackpad moves the page
 * with a soft ease (Lenis). Phones keep their own native scrolling, which is
 * already smooth. Sideways swipes are left alone, so the sliders still scroll by
 * hand, and the page holds still while the phone menu has locked it. Skipped
 * for people who ask the browser for reduced motion.
 * The fade-in on scroll is a separate piece, ScrollReveal, placed in each page.
 */
export function ScrollEffects() {
  // Gliding scroll, set up once for the whole visit.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      allowNestedScroll: true,
      // A mostly sideways gesture belongs to a slider, not the page.
      virtualScroll: ({ deltaX, deltaY }) => Math.abs(deltaY) >= Math.abs(deltaX),
    });

    // The phone menu locks the page by hiding the body's overflow; hold still while it does.
    const syncLock = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start());
    const lock = new MutationObserver(syncLock);
    lock.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      lock.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
