'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icons';

/**
 * A campaign film shown as a still, with a small play mark in its corner. Tapping it plays the film in the same frame, with sound and the browser's own controls; the file
 * itself is only requested at that moment, so the page stays light for
 * everyone who doesn't watch.
 *
 * The film pauses when it is scrolled out of view or the tab is left, and does
 * not start again by itself.
 */
export function CampaignFilm({ src, poster, posterAlt, title, frameClassName, started, onStart, onPlayingChange }: { src: string; poster: StaticImageData; posterAlt: string; title: string; /** Shape of the frame on the page, e.g. a shorter crop on phones. */ frameClassName: string; started: boolean; onStart: () => void; /** Told when the film starts or stops playing, so the slider can hold still. */ onPlayingChange?: (playing: boolean) => void }) {
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!started || !element) return;
    // Keyboard and screen-reader users land on the film's controls, since the still they pressed is gone.
    element.focus({ preventScroll: true });

    const observer = new IntersectionObserver(([entry]) => entry && !entry.isIntersecting && element.pause(), { threshold: 0.15 });
    observer.observe(element);
    const onHidden = () => {
      if (document.hidden) element.pause();
    };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, [started]);

  if (failed) {
    return (
      <p role="alert" className={`flex w-full items-center justify-center bg-raised p-8 text-center text-sm text-mute ${frameClassName}`}>
        The film can’t be played on this device right now.
      </p>
    );
  }

  if (started) {
    return (
      <div className={`relative w-full overflow-hidden bg-raised ${frameClassName}`}>
        <video ref={video} src={src} poster={poster.src} aria-label={title} controls autoPlay playsInline preload="auto" onPlay={() => onPlayingChange?.(true)} onPause={() => onPlayingChange?.(false)} onEnded={() => onPlayingChange?.(false)} onError={() => { setFailed(true); onPlayingChange?.(false); }} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <button type="button" onClick={onStart} className={`group relative block w-full overflow-hidden bg-raised ${frameClassName}`}>
      <Image src={poster} alt={posterAlt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 100vw" quality={85} placeholder="blur" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      {/* In the corner, clear of the bottle in the middle. */}
      <span aria-hidden className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-fg/80 text-white transition-colors group-hover:bg-fg">
        <Icon name="play" strokeWidth={0} fill="currentColor" className="h-4 w-4" />
      </span>
      <span className="sr-only">Play the film: {title}</span>
    </button>
  );
}
