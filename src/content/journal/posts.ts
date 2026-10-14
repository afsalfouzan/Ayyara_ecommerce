import type { StaticImageData } from 'next/image';
import men from '@/assets/home/men.jpg';
import unisex from '@/assets/home/unisex.jpg';
import women from '@/assets/home/women.jpg';
import filmOne from '@/assets/home/film-one.jpg';
import storyWater from '@/assets/story/water.jpg';
import { isVisible } from '@/lib/drafts';

/*
 * The journal: articles that answer common fragrance questions. Each article's
 * text is an MDX file in this folder named after its slug; its details live
 * here so lists, the sitemap, llms.txt and the proxy can read them without
 * loading the articles.
 *
 * To publish an article: have the client approve it, set `draft: false`, and
 * set `updated` to the day it was approved.
 */

export const categories = [
  { slug: 'guides', title: 'Fragrance guides', description: 'Plain answers to common questions about wearing and choosing perfume.' },
  { slug: 'seasons', title: 'By season', description: 'Which fragrances suit the weather, and how to wear them in it.' },
  { slug: 'gifting', title: 'Gifting', description: 'Choosing a perfume for someone else.' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export type Post = {
  slug: string;
  title: string;
  /** Meta description: under 155 characters. */
  description: string;
  /** Two or three sentences shown at the top of the article, answering its question. */
  summary: string;
  category: CategorySlug;
  /** An author's slug from content/authors.ts. */
  author: string;
  published: string;
  updated: string;
  image: StaticImageData;
  imageAlt: string;
  draft: boolean;
};

export const posts: Post[] = [
  {
    slug: 'edp-vs-edt-vs-parfum',
    title: 'EDP vs EDT vs Parfum: what’s the difference?',
    description: 'Parfum, eau de parfum and eau de toilette differ mainly in how much perfume oil they contain, which changes how long they last and how strong they are.',
    summary:
      'The difference is concentration: how much perfume oil is dissolved in the alcohol. Parfum has the most, eau de parfum (EDP) a little less, and eau de toilette (EDT) less again, so they generally last and project in that order.',
    category: 'guides',
    author: 'perfumer',
    published: '2026-10-14',
    updated: '2026-10-14',
    image: filmOne,
    imageAlt: 'A clear bottle of ONE by Ayyara Rebirth against a deep rose background',
    draft: true,
  },
  {
    slug: 'how-to-make-perfume-last-longer',
    title: 'How to make perfume last longer',
    description: 'Apply perfume to moisturised skin on pulse points, don’t rub it in, and store the bottle away from heat and light. Here is why each step helps.',
    summary:
      'Apply perfume to clean, moisturised skin, spray rather than rub, and choose spots that stay warm. Keep the bottle closed, cool and out of the light so the fragrance itself stays at its best.',
    category: 'guides',
    author: 'perfumer',
    published: '2026-10-14',
    updated: '2026-10-14',
    image: unisex,
    imageAlt: 'Three Ayyara Rebirth bottles on a stone at the edge of a calm lake',
    draft: true,
  },
  {
    slug: 'how-to-choose-your-signature-scent',
    title: 'How to choose your signature scent',
    description: 'Start from the scent families you already like, test on your own skin, and wait a few hours before deciding. A step-by-step guide.',
    summary:
      'Start with the scent families you already enjoy, test no more than two or three perfumes at a time on your own skin, and judge them after a few hours, not in the first minute.',
    category: 'guides',
    author: 'founder',
    published: '2026-10-14',
    updated: '2026-10-14',
    image: men,
    imageAlt: 'An Ayyara Rebirth bottle on a mossy rock in a sunlit forest',
    draft: true,
  },
  {
    slug: 'best-perfumes-for-summer',
    title: 'Best perfumes for summer',
    description: 'Fresh, citrus, aquatic and green fragrances suit the heat best. How to wear perfume in summer, and which of ours are made for it.',
    summary:
      'In hot weather, lighter scent families such as citrus, aquatic, green and fresh tend to feel best, and fewer sprays go further because heat makes fragrance project more.',
    category: 'seasons',
    author: 'perfumer',
    published: '2026-10-14',
    updated: '2026-10-14',
    image: storyWater,
    imageAlt: 'Calm water at dawn',
    draft: true,
  },
  {
    slug: 'perfume-gift-guide',
    title: 'Perfume gift guide',
    description: 'How to choose a perfume someone will actually wear: start from what they already like, consider a unisex scent, and order in time for delivery.',
    summary:
      'Choose from what the person already wears, lean towards a unisex or widely liked scent family if you are unsure, and allow for delivery time before the occasion.',
    category: 'gifting',
    author: 'founder',
    published: '2026-10-14',
    updated: '2026-10-14',
    image: women,
    imageAlt: 'Two Ayyara Rebirth bottles beside pearls and silver silk',
    draft: true,
  },
];

export const visiblePosts = () => posts.filter(isVisible).sort((a, b) => b.published.localeCompare(a.published));

export function findPost(slug: string) {
  return visiblePosts().find((post) => post.slug === slug) ?? null;
}

export function categoryOf(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

/** Categories that have at least one article to show. */
export const visibleCategories = () => categories.filter((category) => visiblePosts().some((post) => post.category === category.slug));
