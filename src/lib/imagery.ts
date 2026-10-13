import hero from '@/assets/home/hero.jpg';
import men from '@/assets/home/men.jpg';
import unisex from '@/assets/home/unisex.jpg';
import women from '@/assets/home/women.jpg';

/**
 * Photography for the home page, kept in the project (src/assets/home) at the
 * size it was supplied, so every screen gets a sharp, correctly sized copy and
 * a soft preview while it loads.
 *
 * The hero is 1024 px square and the collection photos 1200 × 896. Larger
 * originals (2400 px wide or more) can replace them under the same file names.
 */
export const imagery = {
  hero: { src: hero, alt: 'Ayyara Rebirth Epic perfume resting on driftwood with pear, vanilla and white blossom' },
  men: { src: men, alt: 'An Ayyara Rebirth bottle in smoked glass on dark wood and leather' },
  women: { src: women, alt: 'An Ayyara Rebirth bottle resting on ivory and rose silk' },
  unisex: { src: unisex, alt: 'An Ayyara Rebirth bottle with a marble cap on travertine stone' },
} as const;
