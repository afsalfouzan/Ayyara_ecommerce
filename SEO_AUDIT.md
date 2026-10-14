# SEO / AEO / GEO / AIO audit: Ayyara Rebirth storefront

Audited 2026-10-14 at commit `fd02820`. No code was changed.

**Method:** a production build of the storefront, with its address set to `https://ayyararebirth.com`, was served locally and read from the local backend (read only). Every page was fetched **without running JavaScript**, which is what Bing, ChatGPT, Perplexity and Claude's crawlers see, and what Google sees before it renders. Product data was the single local product, *Ayyara One*.

> **Domain note (added after the audit):** the crawl used the bare domain `https://ayyararebirth.com`. The production address will be `https://www.ayyararebirth.com`, so the canonical, sitemap and Open Graph addresses below will carry `www.` once that is set. Nothing else in the findings changes.

## Brand details

| Item | Value | Status |
|---|---|---|
| Brand name | Ayyara Rebirth | Set (`src/lib/site.ts`) |
| Production domain | `https://www.ayyararebirth.com` | Comes from `NEXT_PUBLIC_SITE_URL` on Vercel. **Must be set exactly to this on production.** The bare `ayyararebirth.com` redirects to `www`, as it does today. The domain currently serves the old WordPress site; see section 7 |
| Logo | `/public/brand/ayyara-logo.png` | Used in Organization data |
| Social profiles | Instagram, Facebook | **Missing.** Both are bare placeholders (`https://www.instagram.com/`), so no `sameAs` is published |
| Email / phone | ayyararebirthofficial@gmail.com · +91 8606777746 | Set |
| Hours | Monday – Saturday, 10:00 – 18:00 IST | Set (to be confirmed by the client) |
| Currency | INR | Set |
| Address | Veliyamthode, Chandakunnu, Malappuram, Kerala 679329 | Set. **Unknown whether customers can visit**, which decides whether to describe the shop as a local store |

## 1. Framework

- **Next.js 16.4.0** with **React 19.3**, **App Router** only (no `pages/` folder).
- Settings in use:
  - `cacheComponents: true`: Partial Prerendering, where pages are prerendered and parts of them stream in
  - the React Compiler
  - `'use cache'` on catalogue reads, refreshed every few minutes
- Metadata uses Next's built-in API: `metadata` and `generateMetadata`, `robots.ts`, `sitemap.ts` and `opengraph-image.tsx`.

## 2. Routes and data

| Route | Type | Indexed | Notes |
|---|---|---|---|
| `/` | Static, refreshed every minute | Yes | Hero film, collections, film section, best sellers |
| `/shop` | Static, refreshed every minute | Yes | All perfumes |
| `/shop/[collection]` | Static for `men`, `women`, `unisex` | Yes | Unknown collections, see P1-2 |
| `/offers` | Static, refreshed every minute | Yes | |
| `/products/[slug]` | Prerendered for each known product | Yes | Main content streams in, see P2-1. Unknown products, see P1-1 |
| `/our-story` | Static | Yes | Brand story |
| `/about` | Static, the **same page** as `/our-story` | Yes | Canonical points to `/our-story`, see P2-5 |
| `/contact` | Static | Yes | Contact form and six questions with answers |
| `/shipping-returns`, `/privacy-policy`, `/terms` | Static | Yes | Policies |
| `/search` | Partial | No (`noindex, follow`) | Correct |
| `/cart`, `/checkout`, `/order/[orderNumber]` | Client-side | No | Correct; also blocked in robots.txt |
| `/opengraph-image`, `/products/[slug]/opengraph-image` | Generated images | n/a | Share cards |
| `/robots.txt`, `/sitemap.xml` | Generated | n/a | See section 4 |

There is **no blog or guides section**.

**Where data comes from:** the Express backend's public store API, read on the server only:
- `/store/products` for the catalogue
- `/store/products/:slug` for one product
- a best-sellers endpoint

This happens in `src/lib/catalog.ts`. Each product has:
- name, tagline, concentration and gender
- a description
- structured `notes` (top, heart, base), which can be empty
- an SEO title and description, which can be empty
- images with alt text
- sizes (variants) with price, MRP and stock status

Collections are fixed in code (`src/lib/site.ts`), not stored in the database.

## 3. Server vs client rendering

All pages that should be indexed are rendered on the server. **Product names, prices and descriptions are in the HTML before any JavaScript runs.** The client components are only interactive parts:
- header menu and search
- bag
- gallery and size picker
- add to bag
- forms
- hero film

The product grid component (`CatalogListings`) is also a client component, but it is rendered on the server too, so its products and prices are in the initial HTML.

Two points to flag:

- **Product page: the main content streams in after the footer.** The perfume's name, price, description and notes are delivered inside hidden `<div hidden id="S:0">` blocks at the end of the HTML, and a small script moves them into place. The text is in the HTML, so Google (which runs JavaScript) is fine. Crawlers that don't run JavaScript see it out of order and inside a hidden element. Most AI crawlers (GPTBot, PerplexityBot, ClaudeBot) don't run JavaScript. In the same HTML, the footer's headings come **before** the page's `<h1>`.
- The search page streams in the same way; it is not indexed, so this doesn't matter there.

No page that should be indexed depends on client-side JavaScript for its key content.

## 4. What exists today

| Check | Result |
|---|---|
| Titles | Every page has one; all are 23–58 characters. Home: "Ayyara Rebirth \| Fine Fragrances For Modern You", which contains neither "perfume" nor India/Kerala |
| Meta descriptions | Every page has one, but most are short (67–103 characters). The product's is 79 characters and comes from the description's first paragraph |
| Canonical URLs | On every page that should be indexed; absolute and on the bare domain |
| Open Graph / Twitter | On every page. One share image for the site, and a generated one per product. `summary_large_image` |
| robots meta | Live site: `index, follow`. Staging, previews and localhost: `noindex, nofollow`, and robots.txt blocks everything there |
| robots.txt | Allows everything except bag, checkout, order, invoice and API. Lists the sitemap. **Has no rules for AI crawlers** (they fall under `*`, so they are allowed) |
| sitemap.xml | 10 fixed pages plus each product with its last-changed date. **`/shop/unisex` is missing** |
| Structured data (JSON-LD) | **Organization** on every page: name, logo, email, phone, address, no `sameAs`. **BreadcrumbList** on shop, collection, product, contact and policy pages. **Product** on product pages, with one Offer per size (INR price, stock status, condition, seller) |
| Missing structured data | WebSite, a search box, FAQPage, ItemList, Store/LocalBusiness, shipping and return-policy details on Offers, `priceValidUntil` |
| Ratings | None, which is correct while there are no real reviews |
| One `<h1>` per page | Yes on every page. Hierarchy otherwise sound; the footer's "Shop / About / Help" are `<h2>`s on every page |
| Image alt text | Product photos, collection photos and Our Story photos have alt text. **Product card images have `alt=""`** (the name is printed next to them, so this is valid, but it gives image search nothing). The hero film has an `aria-label` |
| Internal linking | Header and footer link to shop, collections, offers, story, contact and policies (12–13 links a page). Product pages link to related products. Collections link to products. **The home page doesn't link to every collection in text.** **Product pages don't link back to their collection** apart from the breadcrumb |
| `llms.txt` | Missing (404) |
| Web manifest | Missing (404); minor |
| Page text | Home 293 words, shop pages about 140, product page 179. Thin for answer engines |

## 5. Problems found

1. **Unknown product addresses return `200` with an empty page:** no title, no `<h1>`, no `noindex`. For example `/products/does-not-exist`. Google treats these as "soft 404s". The code tries to return a real 404, but with streaming the status is sent before the product lookup finishes.
2. **Unknown collection addresses** (`/shop/kids`) return `200` with `noindex` and an almost empty body, instead of a 404.
3. **`/shop/unisex` is not in the sitemap.**
4. **`/about` is a duplicate of `/our-story`.** The canonical tag handles it, but a permanent redirect is cleaner.
5. **Social profiles are placeholders**, so AI and knowledge panels can't connect the site to the brand's Instagram or Facebook.
6. **Product data quality (local data; staging and production may differ).** *Ayyara One* has its notes typed into the description ("Top : sea water, lavender / Mid: sandlwood and jadmine / Base:lavender and agarwood"), with spelling mistakes. The structured notes field is empty. As a result:
   - the "Top / Heart / Base notes" section doesn't show
   - the meta description and the Product data's description are a list of notes, not a sentence
7. **Claims to confirm before indexing:** the Our Story page has "100% Satisfaction Guarantee", "Uncompromising Quality" and "Swift Secure Delivery". AI answers may quote these, so the client should confirm them.
8. **Product image addresses come from the backend**, for example `http://localhost:4000/uploads/...` locally. On production they must be public `https://` addresses on the API domain, or Google's product results will reject them. Check once production exists.

## 6. Prioritised fix list

### P1: fix before go-live (affects indexing directly)
1. **Real 404 for unknown products and collections** (problems 1 and 2). Make sure the status code is 404, not a streamed 200.
2. **Add `/shop/unisex` to the sitemap**, and list collections from `site.ts` so a new collection can't be missed again.
3. **Redirect `/about` to `/our-story`** permanently (308).
4. **Redirects from the old site's main addresses** to the new pages (the list in section 7). They do nothing until the domain points at the new site, so they are safe to add now.
5. **Social profile addresses** in `site.ts`, so `sameAs` is published. *Needs the real URLs from the client.*
6. **Production settings:** `NEXT_PUBLIC_SITE_URL=https://www.ayyararebirth.com` exactly, and the bare domain redirecting to `www` in Vercel. *The user's step.*

### P2: structured data and crawlability (AEO / GEO / AIO)
1. **Render the product page's main content in place, not streamed after the footer**, so crawlers that don't run JavaScript read it in order and outside hidden blocks.
2. **WebSite** structured data, with a search box pointing at `/search?q=`.
3. **FAQPage** on `/contact`, built from the same question list the page shows, so they can't drift apart.
4. **ItemList** on `/shop`, collection pages and `/offers`.
5. **Offer details:** shipping (free, 3–5 working days, India) and a return policy (7 days) from `site.policies`, plus `priceValidUntil`.
6. **Product extras:**
   - fragrance notes as `additionalProperty`, when the notes field is filled
   - `category` and audience (men, women, unisex)
   - size
7. **Organization → OnlineStore** (or Store/LocalBusiness if customers can visit), with opening hours and contact point. *Needs a client answer on visits.*
8. **robots.txt:** name the AI crawlers explicitly and allow them (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, Bingbot), keeping the same private-page blocks.
9. **`/llms.txt`:** a plain-text summary of the brand, collections, products with prices, policies and key links. Generated from the catalogue so it stays current.

### P3: content and on-page (rankings and answer quality)
1. **Home title and description** that say "perfume" and "India", for example "Ayyara Rebirth | Luxury Perfumes & Eau de Parfum in India".
2. **Longer meta descriptions** (140–160 characters) for shop, collection and policy pages.
3. **Product data:** move notes into the notes fields and fix the spelling; fill in each product's SEO title and description in the admin. *Done in the admin, by the client or the user.*
4. **Descriptive alt text on product cards**, for example "Ayyara One eau de parfum 60 ml bottle".
5. **Internal links:** product page to its collection; home page text links to each collection.
6. **Answer-style content:**
   - a short questions-and-answers block on each product page (who it's for, when to wear it, how long it lasts), only with facts the client confirms
   - later, a small guides section (for example "how to choose a perfume", "how to make perfume last longer")
7. **Confirm or reword the Our Story claims** (problem 7).

### P4: launch and after (the user's steps)
1. Switch the domain to the new site (section 7), then verify it in **Google Search Console** and **Bing Webmaster Tools** and submit the sitemap. Bing's index feeds ChatGPT search and Copilot.
2. Run **Google's Rich Results Test** on a product page, contact and home.
3. Create a **Google Business Profile** if the shop can be visited or delivers locally.
4. Check **PageSpeed Insights** on a phone, with the hero film's size in mind (2.4 MB on every home visit).

## 7. Moving from the old site

`ayyararebirth.com` currently serves the old site:
- built about two weeks before this audit
- WordPress and WooCommerce, with Elementor
- no SEO work done on it
- served at `https://www.ayyararebirth.com`, with the bare domain redirecting to `www`
- Google's Site Kit plugin is installed, so Search Console may or may not be connected; check before launch

Because it is new and has no SEO work, it has almost no search ranking to protect. A short list of redirects still covers the addresses people may have shared on Instagram or WhatsApp, or that Google has picked up:

| Old address | New page |
|---|---|
| `/shop/`, `/all-products/` | `/shop` |
| `/mens-collections/` | `/shop/men` |
| `/womens-collections/` | `/shop/women` |
| `/product/one/` | the ONE product page (slug to confirm on production; `ayyara-one` locally) |
| `/product/legacy/` | the Legacy product page if it is sold on the new site, otherwise `/shop` |
| `/about-us/` | `/our-story` |
| `/contact-us/` | `/contact` |
| `/refund_returns/` | `/shipping-returns` |
| `/terms-conditions/` | `/terms` |
| `/privacy-policy/` | `/privacy-policy` (same address; the trailing slash is handled) |

The home page keeps its address. Every other old address (haircare, skin, hello-world, author, category, form and template pages, `my-account`) shows "not found".

**Launch-day steps (the user's, planned together):**
1. Keep a backup of the old WordPress site.
2. Set `NEXT_PUBLIC_SITE_URL=https://www.ayyararebirth.com` on the production Vercel project and add both `www.ayyararebirth.com` and `ayyararebirth.com` there, with the bare domain redirecting to `www`.
3. In Hostinger, point `www` and the bare domain at Vercel. This is the switch-over: the old site stops being served from that moment.
4. Check that the old addresses above redirect, then verify the domain in Google Search Console and Bing Webmaster Tools and submit `https://www.ayyararebirth.com/sitemap.xml`.

## Information needed from the client

- Which product slugs the new site will use for ONE and Legacy (for the redirects).
- Instagram and Facebook page addresses, and any YouTube, WhatsApp Business or Google Business links.
- Whether customers can visit the Malappuram address, and the confirmed opening hours.
- For each perfume:
  - notes (top, heart, base)
  - concentration
  - any longevity or projection statements they are willing to stand behind
- Whether "100% Satisfaction Guarantee" and the other Our Story claims are accurate.
- The real questions customers ask, for FAQ and guide content.
