import type { MetadataRoute } from 'next';
import { absoluteUrl, isLiveSite } from '@/lib/site';

/** Pages that belong to one shopper's visit, with nothing for search: also marked noindex. */
const PRIVATE = ['/cart', '/checkout', '/order/', '/invoice/', '/account', '/api/'];

/**
 * AI and search crawlers named outright, so the welcome is explicit. A crawler
 * obeys only the group that names it, so each repeats the private pages.
 *   GPTBot, OAI-SearchBot, ChatGPT-User  OpenAI: training, ChatGPT search, and pages a ChatGPT user opens
 *   ClaudeBot                            Anthropic
 *   PerplexityBot                        Perplexity
 *   Google-Extended                      Gemini and Google's AI features
 *   Bingbot                              Bing, which also feeds ChatGPT search and Copilot
 */
const NAMED_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Bingbot'];

export default function robots(): MetadataRoute.Robots {
  // Staging and preview copies must never compete with the real site in search results.
  if (!isLiveSite) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: NAMED_CRAWLERS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
