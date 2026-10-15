import type { Product } from './types';

/*
 * The facts every perfume page shows: its "Fragrance profile" table and the
 * questions it answers. Both come only from the perfume's standard details
 * (concentration and who it is made for); nothing is filled in by guesswork.
 */

/** The rows of the "Fragrance profile" table, in reading order. */
export function profileRows(product: Product) {
  return [
    { label: 'Concentration', value: product.concentration },
    { label: 'Made for', value: { men: 'Men', women: 'Women', unisex: 'Everyone (unisex)' }[product.gender] },
  ];
}

export type ProductFaq = { question: string; answer: string; detail?: string };

/** Buyers' questions about this perfume, each answered from its own details. */
export function productFaqs(product: Product): ProductFaq[] {
  const { name } = product;
  return [
    {
      question: `Is ${name} unisex?`,
      answer:
        product.gender === 'unisex'
          ? `Yes. ${name} is a unisex fragrance, made to be worn by anyone.`
          : `No. ${name} is a ${product.gender === 'men' ? 'men’s' : 'women’s'} fragrance, from our ${product.gender === 'men' ? 'For Him' : 'For Her'} collection.`,
    },
  ];
}

/** The FAQ answer as one piece of text, exactly as the page shows it. */
export function faqText(faq: ProductFaq) {
  return faq.detail ? `${faq.answer} ${faq.detail}` : faq.answer;
}
