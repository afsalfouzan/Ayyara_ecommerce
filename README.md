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
- WooCommerce redirect list in `next.config.ts` — extend with the exact URLs from the live site

## Brand logo

The official logo is traced to vector paths in `components/brand/logo-paths.ts`; `Logo` renders the `wordmark` (header) or `full` stacked version (footer) in ink or ivory. `app/icon.svg` and `app/apple-icon.png` are the favicon. `public/brand/ayyara-logo.png` (ink) is used in structured data, and `ayyara-logo-white.png` is the header image in customer emails, so keep both deployed at the storefront URL.

## Notes

- Catalogue comes from the backend (`lib/catalog.ts`, cached for a few minutes). Product pages show each size with MRP struck through, selling price and % off.
- The bag (`localStorage`, per size) is re-priced against `/store/cart/quote` whenever it is opened; the backend re-prices and reserves stock again when the order is placed.
- Checkout places the order (stock reserved for 30 minutes), opens Razorpay Checkout (`lib/razorpay.ts`, script loaded on demand), sends the signed result to the backend for verification and shows `/order/[number]?t=…`. If the customer closes the payment window, the order page offers **Pay now** until the reservation ends. If the backend has no Razorpay keys, the order page says no payment was taken.
- Set `NEXT_PUBLIC_API_URL` (browser) and optionally `API_URL` (server) to the backend.
