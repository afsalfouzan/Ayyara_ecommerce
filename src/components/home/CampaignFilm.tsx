'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icons';

/**
 * A campaign film shown as a still with a play button. Pressing it opens the
 * film in a popup; the file itself is only requested at that moment, so the
 * page stays light for everyone who doesn't watch.
 *
 * The popup is a native <dialog>: it keeps keyboard focus inside, closes on
 * Escape, and hands focus back to the play button afterwards. Closing it by
 * any route unloads the film, which stops picture and sound at once.
 */
export function CampaignFilm({ src, poster, posterAlt, title, width, height, frameClassName }: { src: string; poster: StaticImageData; posterAlt: string; title: string; width: number; height: number; /** Shape of the still on the page, e.g. a shorter crop on phones. The popup always uses the film's own shape. */ frameClassName: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    if (!open) return;

    // The page behind stays still while the film is open.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Leaving the tab pauses the film; it does not start again by itself.
    const onHidden = () => {
      if (document.hidden) video.current?.pause();
    };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setFailed(false);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={`group relative block w-full overflow-hidden bg-raised ${frameClassName}`}>
        <Image src={poster} alt={posterAlt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 100vw" quality={85} placeholder="blur" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/95 text-fg shadow-[0_6px_24px_rgba(41,39,36,0.25)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:h-20 sm:w-20">
            <Icon name="play" strokeWidth={0} fill="currentColor" className="ml-1 h-6 w-6 sm:h-7 sm:w-7" />
          </span>
        </span>
        <span className="sr-only">Play the film: {title}</span>
      </button>

      <dialog
        ref={dialog}
        aria-label={title}
        onClose={close}
        // A click on the dimmed area around the film closes it.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-fg/45 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="relative bg-surface p-2 shadow-[0_24px_80px_rgba(41,39,36,0.35)] sm:p-3">
            <button type="button" onClick={close} aria-label="Close the film" className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-md transition-colors hover:bg-canvas">
              <Icon name="close" strokeWidth={1.8} className="h-5 w-5" />
            </button>
            {failed ? (
              <p role="alert" className="flex max-w-xs items-center justify-center p-8 text-center text-sm text-mute" style={{ height: 'min(60svh, 28rem)' }}>
                The film can’t be played on this device right now.
              </p>
            ) : (
              // The film keeps its own shape and is sized to fit inside the screen, with room for the close button.
              <video
                ref={video}
                src={src}
                poster={poster.src}
                width={width}
                height={height}
                controls
                autoPlay
                playsInline
                preload="auto"
                onError={() => setFailed(true)}
                className="block h-auto max-h-[calc(100svh-5rem)] w-auto max-w-[calc(100vw-3rem)] bg-raised"
                style={{ aspectRatio: `${width} / ${height}` }}
              />
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
