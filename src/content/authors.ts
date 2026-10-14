import { isVisible } from '@/lib/drafts';

/*
 * The people behind the journal and the brand. A profile stays a draft (hidden
 * on the live site) until the client supplies and approves the real details;
 * nothing here may be invented.
 *
 * TODO(client data): the founder's and the perfumer's names, roles, bios,
 * photos and public profiles.
 */
export type Author = {
  slug: string;
  name: string;
  role: string;
  /** Short line for article bylines. */
  summary: string;
  /** Paragraphs for the profile page. */
  bio: string[];
  /** Public profiles (Instagram, LinkedIn…), used as sameAs. */
  profiles: string[];
  draft: boolean;
};

export const authors: Author[] = [
  {
    slug: 'founder',
    name: 'Founder name to be confirmed',
    role: 'Founder, Ayyara Rebirth',
    summary: 'DRAFT: one line about the founder, from the client.',
    bio: ['DRAFT: the founder’s story in their own words: who they are, why they started Ayyara Rebirth, and their background in fragrance. To be supplied by the client.'],
    profiles: [],
    draft: true,
  },
  {
    slug: 'perfumer',
    name: 'Perfumer name to be confirmed',
    role: 'Perfumer',
    summary: 'DRAFT: one line about the perfumer, from the client.',
    bio: ['DRAFT: the perfumer’s training, experience and how they compose Ayyara Rebirth fragrances. To be supplied by the client.'],
    profiles: [],
    draft: true,
  },
];

export const visibleAuthors = () => authors.filter(isVisible);

export function findAuthor(slug: string) {
  return visibleAuthors().find((author) => author.slug === slug) ?? null;
}
