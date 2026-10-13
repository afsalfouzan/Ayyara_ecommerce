import bestSellers from '@/assets/home/best-sellers.jpg';
import hero from '@/assets/home/hero.jpg';
import men from '@/assets/home/men.jpg';
import story from '@/assets/home/story.jpg';
import women from '@/assets/home/women.jpg';

/**
 * Editorial photography for the home page, kept in the project (src/assets/home)
 * at full size so every screen gets a sharp, correctly sized copy and a soft
 * preview while it loads.
 *
 * These are still the concept images from the design mock-up (1408 px wide at
 * most). Replace the files with Ayyara's own photography before launch, ideally
 * 2400 px wide or more, keeping the same file names.
 */
export const imagery = {
  hero: { src: hero, alt: 'Ayyara fine fragrances resting on lakeside stone with a volcanic mountain vista' },
  men: { src: men, alt: 'Men’s perfume still life on dark black satin' },
  women: { src: women, alt: 'Women’s perfume still life on draped silk with a pearl necklace' },
  story: { src: story, alt: 'Artisanal basket with an Ayyara perfume surrounded by fresh fruit' },
  bestSellers: { src: bestSellers, alt: 'Classical bust sculpture styled with an Ayyara fragrance' },
} as const;
