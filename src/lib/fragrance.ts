import type { FragranceProfile, Occasion, Product, Projection, Season } from './types';

/*
 * A perfume's fragrance profile, turned into the rows of the "Fragrance
 * profile" table and the answers of its questions. Everything here comes from
 * what the shop entered in the admin: an empty field gives no row and no
 * question, and nothing is filled in by guesswork.
 *
 * TODO(client data): most perfumes have no profile yet. The admin's perfume
 * editor has the fields; MISSING_PRODUCT_DATA.md lists what each perfume is
 * missing (npm run report:missing-data regenerates it).
 */

const EMPTY: FragranceProfile = { fragranceFamily: null, longevityHours: null, projection: null, seasons: [], occasions: [], similarScents: null, keyIngredients: [], allergens: null, perfumer: null, launchYear: null };

/** The profile, or an empty one when the API predates it. */
export function profileOf(product: Product): FragranceProfile {
  return product.profile ?? EMPTY;
}

const PROJECTION: Record<Projection, string> = { soft: 'Soft: stays close to the skin', moderate: 'Moderate: noticed within arm’s length', strong: 'Strong: fills the space around you' };
const SEASON: Record<Season, string> = { summer: 'Summer', monsoon: 'Monsoon', winter: 'Winter' };
const SEASON_IN_TEXT: Record<Season, string> = { summer: 'summer', monsoon: 'the monsoon', winter: 'winter' };
const OCCASION: Record<Occasion, string> = { daytime: 'Daytime', office: 'Office', casual: 'Casual', evening: 'Evening', 'date night': 'Date night', 'special occasions': 'Special occasions' };
const DAY: Occasion[] = ['daytime', 'office', 'casual'];
const NIGHT: Occasion[] = ['evening', 'date night'];
const ALL_SEASONS = Object.keys(SEASON) as Season[];

/** "a", "a and b", "a, b and c". */
export function joinList(items: string[]) {
  return items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

function hoursText({ min, max }: { min: number; max: number }) {
  return min === max ? `${min} hours` : `${min} to ${max} hours`;
}

const article = (word: string) => (/^[aeiou]/i.test(word) ? 'an' : 'a');

/** The facts to show in the "Fragrance profile" table, in reading order. Empty fields are left out. */
export function profileRows(product: Product) {
  const profile = profileOf(product);
  const notes = product.notes ?? { top: [], heart: [], base: [] };
  const rows: { label: string; value: string }[] = [];
  const add = (label: string, value: string | null | undefined) => value && rows.push({ label, value });
  add('Fragrance family', profile.fragranceFamily);
  add('Concentration', product.concentration);
  add('Top notes', notes.top.join(', '));
  add('Heart notes', notes.heart.join(', '));
  add('Base notes', notes.base.join(', '));
  add('Key ingredients', profile.keyIngredients.join(', '));
  add('Longevity', profile.longevityHours && `${hoursText(profile.longevityHours).replace(' to ', '–')} on skin`);
  add('Projection', profile.projection && PROJECTION[profile.projection]);
  add('Best season', profile.seasons.length === ALL_SEASONS.length ? 'All year' : profile.seasons.map((season) => SEASON[season]).join(', '));
  add('Best occasion', profile.occasions.map((occasion) => OCCASION[occasion]).join(', '));
  add('Made for', { men: 'Men', women: 'Women', unisex: 'Everyone (unisex)' }[product.gender]);
  add('Similar scent profile', profile.similarScents);
  add('Perfumer', profile.perfumer);
  add('Launched', profile.launchYear ? String(profile.launchYear) : null);
  add('Allergen information', profile.allergens);
  return rows;
}

export type ProductFaq = { question: string; answer: string; detail?: string };

/**
 * Buyers' questions about this perfume, each answered first in a sentence or
 * two from its own data. A question is asked only when the data to answer it exists.
 */
export function productFaqs(product: Product): ProductFaq[] {
  const { name } = product;
  const profile = profileOf(product);
  const notes = product.notes ?? { top: [], heart: [], base: [] };
  const faqs: ProductFaq[] = [];

  // What it smells like: the family first, then the notes.
  const noteParts = [
    notes.top.length ? `opens with ${joinList(notes.top)}` : '',
    notes.heart.length ? `has ${joinList(notes.heart)} at its heart` : '',
    notes.base.length ? `settles on ${joinList(notes.base)}` : '',
  ].filter(Boolean);
  const notesSentence = noteParts.length ? `It ${joinList(noteParts)}.` : '';
  if (profile.fragranceFamily) {
    faqs.push({ question: `What does ${name} smell like?`, answer: `${name} is ${article(profile.fragranceFamily)} ${profile.fragranceFamily.toLowerCase()} fragrance.`, detail: notesSentence || undefined });
  } else if (notesSentence) {
    faqs.push({ question: `What does ${name} smell like?`, answer: notesSentence.replace(/^It/, name) });
  }

  if (profile.longevityHours) {
    faqs.push({
      question: `How long does ${name} last?`,
      answer: `${name} lasts about ${hoursText(profile.longevityHours)} on skin.`,
      detail: profile.projection ? `Its projection is ${PROJECTION[profile.projection].replace(':', ',').replace(/^\w/, (c) => c.toLowerCase())}.` : undefined,
    });
  }

  faqs.push({
    question: `Is ${name} unisex?`,
    answer:
      product.gender === 'unisex'
        ? `Yes. ${name} is a unisex fragrance, made to be worn by anyone.`
        : `No. ${name} is a ${product.gender === 'men' ? 'men’s' : 'women’s'} fragrance, from our ${product.gender === 'men' ? 'For Him' : 'For Her'} collection.`,
  });

  if (profile.occasions.length) {
    const day = profile.occasions.some((occasion) => DAY.includes(occasion));
    const night = profile.occasions.some((occasion) => NIGHT.includes(occasion));
    const answer =
      day && night ? `Both. ${name} suits the day and the evening.` : day ? `Day. ${name} is best worn during the day.` : night ? `Night. ${name} is best worn in the evening.` : `${name} is best kept for special occasions.`;
    faqs.push({ question: `Is ${name} for day or night?`, answer, detail: `Best occasions: ${joinList(profile.occasions.map((occasion) => OCCASION[occasion].toLowerCase()))}.` });
  }

  if (profile.seasons.length) {
    faqs.push({
      question: `Which season suits ${name} best?`,
      answer:
        profile.seasons.length === ALL_SEASONS.length
          ? `All year round. ${name} suits summer, the monsoon and winter alike.`
          : `${joinList(profile.seasons.map((season) => SEASON[season]))}. ${name} is best worn in ${joinList(profile.seasons.map((season) => SEASON_IN_TEXT[season]))}.`,
    });
  }

  if (profile.perfumer) {
    faqs.push({ question: `Who created ${name}?`, answer: `${name} was composed by ${profile.perfumer}${profile.launchYear ? ` and launched in ${profile.launchYear}` : ''}.` });
  } else if (profile.launchYear) {
    faqs.push({ question: `When was ${name} launched?`, answer: `${name} was launched in ${profile.launchYear}.` });
  }

  if (profile.allergens) {
    faqs.push({ question: `Does ${name} contain any allergens?`, answer: `Allergen information for ${name}: ${profile.allergens.replace(/\.?$/, '.')}` });
  }

  return faqs;
}

/** The FAQ answer as one piece of text, exactly as the page shows it. */
export function faqText(faq: ProductFaq) {
  return faq.detail ? `${faq.answer} ${faq.detail}` : faq.answer;
}

/** Profile fields this perfume is missing, in the words used in MISSING_PRODUCT_DATA.md. */
export function missingFields(product: Product) {
  const profile = profileOf(product);
  const notes = product.notes ?? { top: [], heart: [], base: [] };
  const checks: [string, boolean][] = [
    ['Top notes', notes.top.length > 0],
    ['Heart notes', notes.heart.length > 0],
    ['Base notes', notes.base.length > 0],
    ['Fragrance family', Boolean(profile.fragranceFamily)],
    ['Longevity (hours)', Boolean(profile.longevityHours)],
    ['Projection / sillage', Boolean(profile.projection)],
    ['Best season', profile.seasons.length > 0],
    ['Best occasion', profile.occasions.length > 0],
    ['Similar scent profile', Boolean(profile.similarScents)],
    ['Key ingredients', profile.keyIngredients.length > 0],
    ['Allergen information', Boolean(profile.allergens)],
    ['Perfumer', Boolean(profile.perfumer)],
    ['Launch year', Boolean(profile.launchYear)],
  ];
  return checks.filter(([, present]) => !present).map(([label]) => label);
}
