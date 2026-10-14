import { isVisible } from '@/lib/drafts';

/*
 * Facts for the About page that only the client can supply. Each stays a draft
 * (hidden on the live site) until the real, approved wording replaces it.
 *
 * TODO(client data): where the ingredients come from, and how and where each
 * perfume is made (blending, maturing, filling, quality checks).
 */
export const aboutSections: { id: string; title: string; body: string[]; draft: boolean }[] = [
  {
    id: 'sourcing',
    title: 'Where our ingredients come from',
    body: ['DRAFT: which key ingredients are used, where they come from (regions, suppliers or fragrance houses), and anything that can be stated about their quality. To be supplied by the client.'],
    draft: true,
  },
  {
    id: 'craft',
    title: 'How each perfume is made',
    body: ['DRAFT: where the perfumes are composed, blended, matured and bottled, how long each step takes, and the checks every batch goes through. To be supplied by the client.'],
    draft: true,
  },
];

export const visibleAboutSections = () => aboutSections.filter(isVisible);
