'use client';

import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';

/** How long the belt waits after a swipe or scroll before it moves again. */
const RESUME_AFTER_MS = 1500;

/**
 * A row of slides that keeps moving left by itself. People can swipe or scroll
 * it either way at any time; it waits while they do, then carries on. There is
 * no end in either direction: the slides are drawn three times and the belt
 * quietly jumps back by one set when it nears either edge, so after the last
 * slide the first one comes round again.
 * It starts moving only once its middle reaches the middle of the screen.
 * It also waits while `paused` (a film playing), while off screen, and never
 * moves by itself for people who ask the browser for reduced motion.
 */
export function InfiniteBelt({ count, renderCopy, label, secondsPerSlide = 4, paused = false, className = '', style, reveal }: {
  count: number;
  /** Draws one full set of slides as <li> elements; `copy` is 0, 1 or 2, for keys and per-copy state. */
  renderCopy: (copy: number) => ReactNode;
  label: string;
  /** Seconds each slide takes to pass by; the speed stays the same however many slides there are. */
  secondsPerSlide?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Fade in on scroll, like the rest of the page. */
  reveal?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const element = track.current;
    const set = firstSet.current;
    if (!element || !set || count === 0) return;

    const setWidth = () => set.offsetWidth;
    // Start on the middle copy, so there is room to swipe both ways.
    element.scrollLeft = setWidth();
    let position = element.scrollLeft;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let touching = false;
    let lastInput = 0;
    let onScreen = true;
    // The belt first moves once its middle has reached the middle of the screen, so people see it start.
    let started = false;
    const reachedCentre = () => {
      const box = element.getBoundingClientRect();
      return box.top + box.height / 2 <= window.innerHeight / 2;
    };
    let lastFrame = 0;
    let frame = 0;

    // Near either edge, jump by one set; the copies look the same, so nobody sees it.
    const wrap = () => {
      const width = setWidth();
      const shift = element.scrollLeft < width * 0.5 ? width : element.scrollLeft > width * 1.5 ? -width : 0;
      if (!shift) return;
      element.scrollLeft += shift;
      position += shift;
    };

    const tick = (time: number) => {
      const elapsed = lastFrame ? Math.min(time - lastFrame, 64) : 0;
      lastFrame = time;
      if (!started && onScreen && reachedCentre()) started = true;
      const idle = !touching && !pausedRef.current && time - lastInput > RESUME_AFTER_MS;
      if (!reduceMotion && started && onScreen && idle && elapsed > 0) {
        const speed = setWidth() / count / secondsPerSlide; // pixels per second
        position += (speed * elapsed) / 1000;
        element.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      // Our own steps land within a pixel of the position we set; anything else is the shopper.
      if (Math.abs(element.scrollLeft - position) > 1.5) {
        lastInput = performance.now();
        position = element.scrollLeft;
      }
      wrap();
    };
    const onDown = () => {
      touching = true;
      lastInput = performance.now();
    };
    const onUp = () => {
      touching = false;
      lastInput = performance.now();
    };
    const onWheel = () => (lastInput = performance.now());

    element.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('touchstart', onDown, { passive: true });
    element.addEventListener('touchend', onUp);
    element.addEventListener('touchcancel', onUp);
    element.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    element.addEventListener('wheel', onWheel, { passive: true });
    const observer = new IntersectionObserver(([entry]) => (onScreen = !!entry?.isIntersecting));
    observer.observe(element);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('touchstart', onDown);
      element.removeEventListener('touchend', onUp);
      element.removeEventListener('touchcancel', onUp);
      element.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      element.removeEventListener('wheel', onWheel);
    };
  }, [count, secondsPerSlide]);

  return (
    <div role="region" aria-label={label} data-reveal={reveal || undefined} style={style} className={`@container min-w-0 ${className}`}>
      {/* relative: hidden screen-reader labels in the cards are positioned, and must stay inside the belt, not widen the page. */}
      <div ref={track} className="relative flex overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* All three copies stay clickable: each is on screen part of the time. */}
        {[0, 1, 2].map((copy) => (
          <ul key={copy} ref={copy === 0 ? firstSet : undefined} className="flex shrink-0">
            {renderCopy(copy)}
          </ul>
        ))}
      </div>
    </div>
  );
}
