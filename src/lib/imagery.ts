import filmAura from '@/assets/home/film-aura.jpg';
import filmLegacy from '@/assets/home/film-legacy.jpg';
import filmOne from '@/assets/home/film-one.jpg';
import hero from '@/assets/home/hero.jpg';
import men from '@/assets/home/men.jpg';
import unisex from '@/assets/home/unisex.jpg';
import women from '@/assets/home/women.jpg';

/**
 * Photography for the home page, kept in the project (src/assets/home) at the
 * size it was supplied, so every screen gets a sharp, correctly sized copy and
 * a soft preview while it loads.
 *
 * The collection photos are the shop's own campaign images (supplied 2026-10-14):
 * For Him is portrait, for the tall card; For Her and Unisex are landscape, for
 * the wide cards. `position` keeps the bottles in view wherever a card crops.
 */
export const imagery = {
  hero: { src: hero, alt: 'Ayyara Rebirth Epic perfume resting on driftwood with pear, vanilla and white blossom' },
  men: { src: men, alt: 'An Ayyara Rebirth bottle on a mossy rock in a sunlit forest, beside hiking boots, a rucksack and a compass', position: 'object-[50%_60%]' },
  women: { src: women, alt: 'Two Ayyara Rebirth bottles beside pearls and silver silk, with a jewellery box behind', position: 'object-[72%_55%]' },
  unisex: { src: unisex, alt: 'Three Ayyara Rebirth bottles on a stone at the edge of a calm lake', position: 'object-[74%_55%]' },
} as const;

/**
 * The film that opens the home page, as supplied (portrait, 720 × 1280, about 14 seconds).
 * It plays silently on a loop; the poster is its first frame, so there is no jump when it starts.
 */
export const heroFilm = {
  src: '/media/ayyara-hero-film.mp4',
  poster: '/media/ayyara-hero-film-poster.jpg',
  label: 'Ayyara Rebirth campaign film: unboxing and wearing ONE',
} as const;

/**
 * The ONE campaign film, as supplied (portrait, 720 × 1280, about 9 seconds, with sound).
 * The file is served from /public unchanged; the poster is a frame taken from it.
 */
export const film = {
  src: '/media/ayyara-one-film.mp4',
  width: 720,
  height: 1280,
  poster: filmOne,
  posterAlt: 'A clear bottle of ONE by Ayyara Rebirth, 60 ml, against a deep rose background',
  title: 'ONE by Ayyara Rebirth',
} as const;

/**
 * The LEGACY campaign film, as supplied (portrait, 720 × 1280, about 10 seconds, with sound),
 * shown after ONE in the film slider. The poster is its middle frame, with the bottle in view.
 */
export const legacyFilm = {
  src: '/media/ayyara-legacy-film.mp4',
  width: 720,
  height: 1280,
  poster: filmLegacy,
  posterAlt: 'A bottle of LEGACY by Ayyara Rebirth, filled with blue perfume, against a dark teal background',
  title: 'LEGACY by Ayyara Rebirth',
} as const;

/**
 * The AURA campaign film, as supplied (portrait, 576 × 1024, about 10 seconds, with sound),
 * shown after LEGACY in the film slider. The poster is the frame at 4.5 seconds, with the bottle in view.
 */
export const auraFilm = {
  src: '/media/ayyara-aura-film.mp4',
  width: 576,
  height: 1024,
  poster: filmAura,
  posterAlt: 'A bottle of AURA by Ayyara Rebirth, 50 ml, with a pink label, against a soft pink background',
  title: 'AURA by Ayyara Rebirth',
} as const;
