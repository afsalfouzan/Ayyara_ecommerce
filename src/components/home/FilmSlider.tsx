'use client';

import type { StaticImageData } from 'next/image';
import { useState } from 'react';
import { CampaignFilm } from './CampaignFilm';
import { InfiniteBelt } from './InfiniteBelt';

type Film = { src: string; poster: StaticImageData; posterAlt: string; title: string };

/**
 * The campaign films on a belt that keeps moving left, like the best sellers,
 * and can be swiped either way. Tapping a still plays that film in place; the
 * belt stands still while a film is playing and moves on once it is paused or ends.
 */
export function FilmSlider({ films, frameClassName }: { films: readonly Film[]; frameClassName: string }) {
  // Each still is drawn three times on the belt, so a film is known by its copy and its place.
  const [started, setStarted] = useState<ReadonlySet<string>>(() => new Set());
  const [playing, setPlaying] = useState<ReadonlySet<string>>(() => new Set());
  const setPlayingFor = (key: string, isPlaying: boolean) =>
    setPlaying((current) => {
      const next = new Set(current);
      if (isPlaying) next.add(key);
      else next.delete(key);
      return next;
    });

  return (
    <InfiniteBelt
      label="Campaign films"
      count={films.length}
      secondsPerSlide={5}
      paused={playing.size > 0}
      renderCopy={(copy) =>
        films.map((film, index) => {
          const key = `${copy}-${index}`;
          return (
            <li key={key} aria-label={film.title} className="mr-5 w-[100cqw] shrink-0">
              <CampaignFilm src={film.src} poster={film.poster} posterAlt={film.posterAlt} title={film.title} frameClassName={frameClassName} started={started.has(key)} onStart={() => setStarted((current) => new Set(current).add(key))} onPlayingChange={(isPlaying) => setPlayingFor(key, isPlaying)} />
            </li>
          );
        })
      }
    />
  );
}

/** The same films side by side and standing still, for laptops: one equal tile each. Tapping a still plays that film in place. */
export function FilmGrid({ films, frameClassName, className = '' }: { films: readonly Film[]; frameClassName: string; className?: string }) {
  const [started, setStarted] = useState<ReadonlySet<number>>(() => new Set());
  return (
    <ul aria-label="Campaign films" className={className}>
      {films.map((film, index) => (
        <li key={film.src}>
          <CampaignFilm src={film.src} poster={film.poster} posterAlt={film.posterAlt} title={film.title} frameClassName={frameClassName} started={started.has(index)} onStart={() => setStarted((current) => new Set(current).add(index))} />
          <p className="mt-3 text-xs font-medium tracking-[0.14em] text-fg uppercase">{film.title}</p>
        </li>
      ))}
    </ul>
  );
}
