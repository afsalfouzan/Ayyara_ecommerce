import { site } from './site';
import type { FragranceNotes, Product } from './types';

/*
 * The facts every perfume page shows: its "Key facts" list, fragrance notes and
 * the questions it answers. They come only from what the shop has stated: the
 * perfume's standard details, the shop's policies, and notes written in the
 * description. Nothing is filled in by guesswork; a fact the shop hasn't given
 * is left out.
 *
 * TODO(owner): "When to wear it", longevity and projection need statements the
 * perfumer will stand behind, so the page has no such section yet.
 */

/** Every Ayyara perfume is an extrait de parfum with this much perfume oil (the shop's own comparison on the home page). */
export const PERFUME_OIL = '40–50%';

/** The rows of the "Fragrance profile" table, in reading order. Also published as structured data. */
export function profileRows(product: Product) {
  return [
    { label: 'Concentration', value: product.concentration },
    { label: 'Perfume oil', value: PERFUME_OIL },
    { label: 'Made for', value: { men: 'Men', women: 'Women', unisex: 'Everyone (unisex)' }[product.gender] },
  ];
}

/** The "Key facts" list on a perfume page: the profile, the sizes, and the shop's delivery and return terms. */
export function keyFacts(product: Product) {
  const { policies } = site;
  return [
    ...profileRows(product),
    { label: 'Size', value: product.variants.map((variant) => `${variant.sizeMl} ml`).join(', ') },
    { label: 'Delivery', value: `Free within ${policies.deliveryArea}, ${policies.deliveryTime}` },
    { label: 'Returns', value: `${policies.returnWindowDays} days, unopened` },
  ].filter((row) => row.value);
}

export type Notes = FragranceNotes;

const NOTE_LABEL = /\b(top|head|heart|mid|middle|base)\s*(?:notes?)?\s*[:\-–]\s*([^/\n|;]+)/gi;

const titleCase = (text: string) => text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

/**
 * Notes written into a description as "Top: sea water, lavender / Heart: sandalwood and jasmine /
 * Base: lavender and agarwood". Returns the notes found, and the description with those
 * segments taken out so they aren't shown twice. Null when the description states no notes.
 */
export function notesFromDescription(description: string): { notes: Notes; rest: string } | null {
  const notes: Notes = { top: [], heart: [], base: [] };
  for (const [, label, list] of description.matchAll(NOTE_LABEL)) {
    const tier = /^(top|head)$/i.test(label) ? 'top' : /^base$/i.test(label) ? 'base' : 'heart';
    notes[tier].push(...list.split(/,|\band\b|&/i).map((note) => titleCase(note.trim().toLowerCase())).filter(Boolean));
  }
  if (!notes.top.length && !notes.heart.length && !notes.base.length) return null;
  const rest = description
    .replace(NOTE_LABEL, '')
    .replace(/^[\s/|;]+|[\s/|;]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { notes, rest };
}

const NOTE_TIERS = [
  ['Top', 'top'],
  ['Heart', 'heart'],
  ['Base', 'base'],
] as const;

/** Notes as sentence text: "Top notes: Sea Water, Lavender. Heart notes: …". */
export function notesText(notes: Notes) {
  return NOTE_TIERS.filter(([, tier]) => notes[tier].length)
    .map(([label, tier]) => `${label} notes: ${notes[tier].join(', ')}.`)
    .join(' ');
}

export type ProductFaq = { question: string; answer: string; detail?: string };

/** Buyers' questions about this perfume, each answered from its own details and the shop's policies. */
export function productFaqs(product: Product): ProductFaq[] {
  const { name } = product;
  const { policies } = site;
  const found = notesFromDescription(product.description);
  return [
    {
      question: `Is ${name} unisex?`,
      answer:
        product.gender === 'unisex'
          ? `Yes. ${name} is a unisex fragrance, made to be worn by anyone.`
          : `No. ${name} is a ${product.gender === 'men' ? 'men’s' : 'women’s'} fragrance, from our ${product.gender === 'men' ? 'For Him' : 'For Her'} collection.`,
    },
    {
      question: `What concentration is ${name}?`,
      answer: `${name} is an ${product.concentration.toLowerCase()} with ${PERFUME_OIL} perfume oil, a higher concentration than eau de parfum.`,
    },
    ...(found ? [{ question: `What are the notes of ${name}?`, answer: notesText(found.notes) }] : []),
    {
      question: `How long does delivery of ${name} take?`,
      answer: `Delivery is free. Orders are dispatched within ${policies.dispatchWindow} and delivered in ${policies.deliveryTime}.`,
    },
    {
      question: `Can I return ${name}?`,
      answer: `Yes, if it is unopened and unused, within ${policies.returnWindowDays} days of delivery.`,
    },
    {
      question: `Where does ${name} ship?`,
      answer: `For now we deliver only to addresses within ${policies.deliveryArea}.`,
    },
  ];
}

/** The FAQ answer as one piece of text, exactly as the page shows it. */
export function faqText(faq: ProductFaq) {
  return faq.detail ? `${faq.answer} ${faq.detail}` : faq.answer;
}
