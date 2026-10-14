import { visibleFaqGroups } from '@/content/faq';
import { posts } from '@/content/journal/posts';
import { cheapestVariant, getProducts } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { profileOf } from '@/lib/fragrance';
import { absoluteUrl, collections, site } from '@/lib/site';

/*
 * /llms.txt: a short Markdown guide to the shop for AI assistants and answer
 * engines (the llmstxt.org format). Built from the live catalogue and the
 * shop's settings, so prices and perfumes are always current; drafts are
 * never listed. Served as a route rather than a file in /public so it can't
 * go stale.
 */
export async function GET() {
  const products = await getProducts().catch(() => []);
  const articles = posts.filter((post) => !post.draft);
  const questions = visibleFaqGroups()
    .flatMap((group) => group.items)
    .filter((faq) => !faq.draft);
  const { policies, contact } = site;

  const productLine = (product: (typeof products)[number]) => {
    const cheapest = cheapestVariant(product);
    const family = profileOf(product).fragranceFamily;
    const sizes = product.variants.map((variant) => `${variant.sizeMl} ml`).join(', ');
    const who = { men: 'for men', women: 'for women', unisex: 'unisex' }[product.gender];
    return `- [${product.name}](${absoluteUrl(`/products/${product.slug}`)}): ${product.concentration}, ${who}${family ? `, ${family.toLowerCase()}` : ''}; ${sizes}${cheapest ? `; from ${formatPrice(cheapest.pricePaise)}` : ''}`;
  };

  const text = [
    `# ${site.name}`,
    '',
    `> ${site.description} An Indian perfume house based in Malappuram, Kerala, selling online across India.`,
    '',
    `- Delivery: free across India; dispatched within ${policies.dispatchWindow}, delivered in ${policies.deliveryWindow}.`,
    `- Returns: unopened products within ${policies.returnWindowDays} days of delivery.`,
    `- Payment: UPI, card or net banking, in Indian rupees.`,
    `- Contact: ${contact.phone}, ${contact.email} (${contact.hours}).`,
    '',
    '## Collections',
    '',
    `- [All perfumes](${absoluteUrl('/shop')})`,
    ...collections.map((collection) => `- [${collection.title}](${absoluteUrl(`/shop/${collection.slug}`)}): ${collection.line}`),
    `- [Offers](${absoluteUrl('/offers')})`,
    '',
    ...(products.length ? ['## Perfumes', '', ...products.map(productLine), ''] : []),
    ...(articles.length ? ['## Journal', '', `- [All articles](${absoluteUrl('/journal')})`, ...articles.map((post) => `- [${post.title}](${absoluteUrl(`/journal/${post.slug}`)}): ${post.description}`), ''] : []),
    '## Help',
    '',
    `- [FAQ](${absoluteUrl('/faq')}): ${questions.length} answers on delivery, returns, authenticity, storage and payment`,
    `- [Delivery & returns](${absoluteUrl('/shipping-returns')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    `- [About Ayyara Rebirth](${absoluteUrl('/our-story')})`,
    '',
    '## Optional',
    '',
    `- [Privacy policy](${absoluteUrl('/privacy-policy')})`,
    `- [Terms of service](${absoluteUrl('/terms')})`,
    '',
  ].join('\n');

  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
