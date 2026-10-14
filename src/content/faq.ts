import { findPost } from '@/content/journal/posts';
import { isVisible } from '@/lib/drafts';
import { site } from '@/lib/site';

/*
 * The shop's common questions, shown on /faq (with FAQPage data) and, in part,
 * on the contact page. Answers are plain text so the structured data carries
 * exactly the words on the page. Facts come from site.ts; anything the shop
 * hasn't confirmed is a draft and stays off the live site.
 *
 * TODO(client data): the draft answers below.
 */
export type Faq = { id: string; question: string; answer: string; link?: { href: string; label: string }; draft?: boolean };

const { dispatchWindow, deliveryWindow, deliveryArea, returnWindowDays } = site.policies;

export const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: 'Delivery',
    items: [
      { id: 'delivery-time', question: 'How long does delivery take?', answer: `Orders are packed and dispatched within ${dispatchWindow} from our atelier in Kerala and delivered in ${deliveryWindow}. You receive the courier’s tracking number by email when your parcel leaves.` },
      { id: 'delivery-cost', question: 'How much does delivery cost?', answer: `Delivery is free on every order within ${deliveryArea}.` },
      { id: 'tracking', question: 'How do I track my order?', answer: 'When your parcel leaves, we email you the courier’s name and tracking number. The link in your order confirmation email also shows the latest status.' },
      { id: 'delivery-area', question: `Do you deliver outside ${deliveryArea}?`, answer: `Not yet. For now we deliver only to addresses within ${deliveryArea}.` },
    ],
  },
  {
    title: 'Returns and refunds',
    items: [
      { id: 'returns', question: 'Can I return a perfume?', answer: `Unopened and unused products in their original packaging can be returned within ${returnWindowDays} days of delivery. For hygiene reasons, opened fragrances cannot be returned unless they arrived damaged or faulty.`, link: { href: '/shipping-returns', label: 'Read the full policy' } },
      { id: 'damaged', question: 'What if my order arrives damaged?', answer: 'Contact us within 48 hours of delivery with your order number and photographs, and we will make it right.', link: { href: '/contact', label: 'Contact us' } },
      { id: 'refunds', question: 'How are refunds paid?', answer: 'Approved refunds are issued to the original payment method. Your bank may take several business days to show the amount after the refund is processed.' },
    ],
  },
  {
    title: 'Authenticity',
    items: [
      { id: 'official-shop', question: 'Is this the official Ayyara Rebirth shop?', answer: `Yes. ${site.url.replace(/^https?:\/\//, '')} is Ayyara Rebirth’s own online shop. Every order is packed and dispatched by us.` },
      { id: 'resellers', question: 'Where else can I buy Ayyara Rebirth perfumes?', answer: 'DRAFT: list any authorised shops or marketplaces, or state that the perfumes are sold only here. To be confirmed by the shop.', draft: true },
    ],
  },
  {
    title: 'Caring for your perfume',
    items: [
      { id: 'storage', question: 'How should I store my perfume?', answer: 'Keep it somewhere cool, dark and dry with the cap on. Heat, sunlight and humidity break fragrance down over time, so avoid bathroom shelves and sunny windowsills; a drawer or the original box is ideal.', link: { href: '/journal/how-to-make-perfume-last-longer', label: 'How to make perfume last longer' } },
      { id: 'shelf-life', question: 'Does perfume expire?', answer: 'DRAFT: the shelf life the shop is willing to state for its perfumes, to be confirmed by the perfumer.', draft: true },
    ],
  },
  {
    title: 'Samples and choosing',
    items: [
      { id: 'samples', question: 'Do you offer samples or testers?', answer: 'DRAFT: to be confirmed by the shop (whether samples are sold or included, and how to get one).', draft: true },
      { id: 'choosing', question: 'How do I choose a perfume online?', answer: 'Each perfume page lists its concentration, notes and who it is made for. Start from the scent families you already like, and contact us if you would like help choosing.', link: { href: '/journal/how-to-choose-your-signature-scent', label: 'How to choose your signature scent' } },
    ],
  },
  {
    title: 'Payment',
    items: [{ id: 'payment', question: 'How can I pay?', answer: 'You can pay securely online by UPI, card or net banking.' }],
  },
];

/** Groups with only the questions that may be shown (drafts only during review), and no empty groups. */
export function visibleFaqGroups() {
  return faqGroups.map((group) => ({ ...group, items: group.items.filter(isVisible) })).filter((group) => group.items.length > 0);
}

export function faqsById(ids: string[]) {
  const all = faqGroups.flatMap((group) => group.items).filter(isVisible);
  return ids.flatMap((id) => all.filter((faq) => faq.id === id));
}

/** A question's "read more" link, unless it points to a journal article that isn't published. */
export function liveLink(faq: Faq) {
  if (!faq.link) return null;
  const article = faq.link.href.match(/^\/journal\/([^/]+)$/)?.[1];
  return article && !findPost(article) ? null : faq.link;
}
