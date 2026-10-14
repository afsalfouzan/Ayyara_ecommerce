'use client';

import type { StaticImageData } from 'next/image';
import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/icons';
import { CampaignFilm } from './CampaignFilm';

type Film = { src: string; poster: StaticImageData; posterAlt: string; title: string };

/**
 * The campaign films side by side in a horizontal slider: swipe on a phone, or
 * use the arrows and dots. Each film keeps its own play button, and a playing
 * film pauses once it is slid out of view.
 */
export function FilmSlider({ films, frameClassName }: { films: readonly Film[]; frameClassName: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: index * element.clientWidth, behavior: 'smooth' });
  };
  const onScroll = () => {
    const element = track.current;
    if (element) setActive(Math.round(element.scrollLeft / element.clientWidth));
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Campaign films">
      <ul ref={track} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {films.map((film, index) => (
          <li key={film.src} aria-roledescription="slide" aria-label={`${index + 1} of ${films.length}: ${film.title}`} className="w-full shrink-0 snap-center">
            <CampaignFilm src={film.src} poster={film.poster} posterAlt={film.posterAlt} title={film.title} frameClassName={frameClassName} />
          </li>
        ))}
      </ul>

      {films.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {films.map((film, index) => (
              <button key={film.src} type="button" onClick={() => goTo(index)} aria-label={`Show film ${index + 1}: ${film.title}`} aria-current={active === index ? 'true' : undefined} className="flex h-6 items-center">
                <span className={`block h-0.5 transition-all duration-300 ${active === index ? 'w-8 bg-fg' : 'w-4 bg-line'}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous film" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-fg disabled:opacity-35 disabled:hover:border-line">
              <Icon name="arrowLeft" strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === films.length - 1} aria-label="Next film" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-fg disabled:opacity-35 disabled:hover:border-line">
              <Icon name="arrowRight" strokeWidth={1.5} className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
