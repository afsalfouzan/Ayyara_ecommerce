'use client';

import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { Icon } from '@/components/ui/icons';

/**
 * The campaign film that opens the home page. It starts by itself, silent and
 * on a loop, and fills whatever box it is given.
 *
 * Browsers only let a film start by itself when it is muted, so sound is off
 * until the visitor turns it on. The film waits for visitors who have asked
 * their device for less motion, and pauses while it is scrolled out of view.
 * Until it plays (or if it can't), the poster frame shows.
 */
export function HeroVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  // The poster is the first thing seen (the page's largest picture), so it is fetched straight away.
  preload(poster, { as: 'image', fetchPriority: 'high' });
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // Set when the visitor presses pause, so scrolling back up doesn't restart it against their wishes.
  const pausedByVisitor = useRef(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    // React doesn't reliably write the `muted` attribute, and autoplay depends on it.
    element.muted = true;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) pausedByVisitor.current = true;
    else void element.play().catch(() => undefined);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) element.pause();
        else if (!pausedByVisitor.current) void element.play().catch(() => undefined);
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      pausedByVisitor.current = false;
      void element.play().catch(() => undefined);
    } else {
      pausedByVisitor.current = true;
      element.pause();
    }
  }

  function toggleSound() {
    const element = video.current;
    if (!element) return;
    element.muted = !element.muted;
    setMuted(element.muted);
  }

  const control = 'flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55';

  return (
    <div className={className}>
      <video ref={video} src={src} poster={poster} aria-label={label} muted loop playsInline preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute top-4 left-4 z-20 flex gap-2 lg:top-auto lg:right-6 lg:bottom-6 lg:left-auto">
        <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause the film' : 'Play the film'} className={control}>
          <Icon name={playing ? 'pause' : 'play'} strokeWidth={0} fill="currentColor" className="h-4 w-4" />
        </button>
        <button type="button" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} aria-pressed={!muted} className={control}>
          <Icon name={muted ? 'soundOff' : 'soundOn'} strokeWidth={1.8} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
