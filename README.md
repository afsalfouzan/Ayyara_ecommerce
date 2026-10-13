# Ayyara Rebirth — Storefront

Public e-commerce site. Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4. Deploys to Vercel.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

- `src/app` — routes: home, `/shop`, `/products/[slug]`, `/cart`, `/checkout`, content and policy pages, `robots.ts`, `sitemap.ts`
- `src/components` — `ui/` primitives, `layout/` header/footer/nav, `product/`, `cart/`, `checkout/`, `seo/`
- `src/lib` — `site.ts` (brand/contact/policy config), `catalog.ts` (data access), `validation/` (Zod), `format.ts`
- Design tokens live in `src/app/globals.css` (`@theme`)

## Placeholders to replace before launch

- Product photography (illustrated bottles are shown until images exist)
- Contact details and policy figures in `lib/site.ts`; policy page copy (marked *Draft* in dev)
- Home-page photography in `lib/imagery.ts` and the social links in `lib/site.ts`

## Launch notes

- **Old links.** `redirects()` in `next.config.ts` covers every address in the WooCommerce sitemap. The two old product links map to `ayyara-one` and `ayyara-legacy` by name; update them if those slugs change.
- **Security headers** are set in `next.config.ts`. The content security policy limits scripts, frames and outgoing requests to this site, the API, photo storage and Razorpay. Add a host there before loading anything from a new service (analytics, chat, fonts), or the browser will block it.
- **Share images.** `app/opengraph-image.tsx` is the site card; `app/products/[slug]/opengraph-image.tsx` draws one per perfume from its first photo. Pages build their link preview with `shareMeta()` (`lib/seo.ts`); a page that sets `openGraph` by hand loses the site name and image.
- **Search engines** may index only the real site: `isLiveSite` (`lib/site.ts`) is false on previews, staging and builds without `NEXT_PUBLIC_SITE_URL`, which then answer `noindex`.
- **Invoice links.** `/invoice/<order number>.pdf?k=…` (sent to customers on WhatsApp) is passed to the API by a rewrite in `next.config.ts`; the API checks the key and builds the PDF. The storefront stores nothing.
- **Photos** on the home and Our Story pages are files in `src/assets`, served sharp at the right size for each screen; replace a file to replace a picture (2400 px wide or more).
- Hosting variables and the go-live checklist are in the backend's `deploy/README.md`.

## Brand logo

The official logo is traced to vector paths in `components/brand/logo-paths.ts`; `Logo` renders the `wordmark` (header) or `full` stacked version (footer) in ink or ivory. `app/icon.svg` and `app/apple-icon.png` are the favicon. `public/brand/ayyara-logo.png` (ink) is used in structured data, and `ayyara-email-header.png` (the logo on its dark band, as one opaque image so dark-mode mail apps cannot hide it) is the header of customer emails; `ayyara-logo-white.png` is kept for emails already sent. Keep all three deployed at the storefront URL.

## Notes

- Catalogue comes from the backend (`lib/catalog.ts`, cached for a few minutes). Product pages show each size with MRP struck through, selling price and % off.
- The bag (`localStorage`, per size) is re-priced against `/store/cart/quote` whenever it is opened; the backend re-prices and reserves stock again when the order is placed.
- Checkout places the order (stock reserved for 30 minutes), opens Razorpay Checkout (`lib/razorpay.ts`, script loaded on demand), sends the signed result to the backend for verification and shows `/order/[number]?t=…`. If the customer closes the payment window, the order page offers **Pay now** until the reservation ends. If the backend has no Razorpay keys, the order page says no payment was taken.
- Set `NEXT_PUBLIC_API_URL` (browser) and optionally `API_URL` (server) to the backend.
