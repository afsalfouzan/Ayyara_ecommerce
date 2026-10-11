import type { Paise, StockStatus } from './types';

const rupees = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Prices as the brand shows them: "Rs. 1,200.00". */
export function formatPrice(paise: Paise) {
  return `Rs. ${rupees.format(paise / 100)}`;
}

/** Decimal rupee string for structured data, e.g. "4500.00". */
export function toRupeeString(paise: Paise) {
  return (paise / 100).toFixed(2);
}

export const stockLabel: Record<StockStatus, string> = {
  in_stock: 'In stock',
  low_stock: 'Only a few left',
  out_of_stock: 'Sold out',
};

/** Decorative bottle colours for products without photography, derived from the slug. */
const PALETTES = [
  { liquid: '#d9b77a', backdrop: '#efe6d6' },
  { liquid: '#5b2a22', backdrop: '#e9dfd2' },
  { liquid: '#2f3a33', backdrop: '#e4e2d7' },
  { liquid: '#b98a8f', backdrop: '#efe4e1' },
  { liquid: '#7a5c2e', backdrop: '#ece3d3' },
];
export function artFor(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length]!;
}

/** Whole-number discount from MRP, e.g. 10 for ₹5,000 → ₹4,500. */
export function discountPercent(mrp: Paise, price: Paise) {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
