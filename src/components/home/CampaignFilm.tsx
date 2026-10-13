'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icons';

/**
 * A campaign film shown as a still with a play button. Pressing it plays the
 * film in the same frame, with sound and the browser's own controls; the file
 * itself is only requested at that moment, so the page stays light for
 * everyone who doesn't watch.
 *
 * The film pauses when it is scrolled out of view or the tab is left, and does
 * not start again by itself.
 */
export function CampaignFilm({ src, poster, posterAlt, title, frameClassName }: { src: string; poster: StaticImageData; posterAlt: string; title: string; /** Shape of the frame on the page, e.g. a shorter crop on phones. */ frameClassName: string }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!started || !element) return;
    // Keyboard and screen-reader users land on the film's controls, since the play button they pressed is gone.
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
        <video ref={video} src={src} poster={poster.src} aria-label={title} controls autoPlay playsInline preload="auto" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setStarted(true)} className={`group relative block w-full overflow-hidden bg-raised ${frameClassName}`}>
      <Image src={poster} alt={posterAlt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 100vw" quality={85} placeholder="blur" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/95 text-fg shadow-[0_6px_24px_rgba(41,39,36,0.25)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:h-20 sm:w-20">
          <Icon name="play" strokeWidth={0} fill="currentColor" className="ml-1 h-6 w-6 sm:h-7 sm:w-7" />
        </span>
      </span>
      <span className="sr-only">Play the film: {title}</span>
    </button>
  );
}
