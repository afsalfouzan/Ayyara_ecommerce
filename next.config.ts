import type { NextConfig } from 'next';

// Images from a backend on this machine (development, or a production build tested
// locally). A real deployment's API is never on localhost, so the SSRF guard stays on there.
const localApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(process.env.NEXT_PUBLIC_API_URL ?? '');

const isDev = process.env.NODE_ENV === 'development';
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').origin;
  } catch {
    return '';
  }
})();

/*
 * Content security policy: what the browser may load and where it may send data.
 * Everything is limited to this site, our API, the product-photo storage and
 * Razorpay (its payment window is a script plus frames on razorpay.com).
 *
 * Scripts: pages are prerendered and served from cache, so they cannot carry a
 * per-request nonce; Next.js needs its own inline bootstrap scripts allowed.
 * No page renders HTML written by customers or staff, which is what that
 * allowance would otherwise expose.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${apiOrigin} https://*.amazonaws.com https://*.cloudfront.net https://*.razorpay.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} https://*.razorpay.com${isDev ? ' ws://localhost:* http://localhost:*' : ''}`,
  'frame-src https://api.razorpay.com https://checkout.razorpay.com',
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev || localApi ? [] : ['upgrade-insecure-requests']),
].join('; ');

/** Where the API serves its own uploaded photos, when it is a real (non-local) https server. */
const apiUploads = (() => {
  if (localApi || !apiOrigin.startsWith('https://')) return null;
  const { hostname, port } = new URL(apiOrigin);
  return { protocol: 'https' as const, hostname, port, pathname: '/uploads/**' };
})();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Product images are served from the S3 bucket (optionally behind CloudFront).
    remotePatterns: [
      { protocol: 'https', hostname: '*.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      // TEMPORARY: home-page concept photography (see lib/imagery.ts).
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/aida-public/**' },
      // Images stored by a local backend.
      ...(localApi ? [{ protocol: 'http' as const, hostname: 'localhost', port: '4000', pathname: '/uploads/**' }] : []),
      // A backend that keeps product photos on its own disk (staging) serves them from /uploads.
      ...(apiUploads ? [apiUploads] : []),
    ],
    dangerouslyAllowLocalIP: localApi,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          // Browsers ignore this over plain http, so it is harmless on localhost.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },

  /**
   * Permanent redirects from the old WooCommerce site, so search rankings and
   * shared links carry over. Checked against that site's own sitemap
   * (www.ayyararebirth.com/wp-sitemap.xml) on 12 Oct 2026: every address it
   * lists lands on a live page here. Add a line when an old link turns up 404.
   */
  async redirects() {
    const to = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      // Perfumes: the old slugs had no "ayyara-" prefix.
      to('/product/one', '/products/ayyara-one'),
      to('/product/legacy', '/products/ayyara-legacy'),
      to('/product/:slug', '/products/:slug'),
      to('/product', '/shop'),

      // Collections and category pages.
      to('/product-category/men/:path*', '/shop/men'),
      to('/product-category/women/:path*', '/shop/women'),
      to('/product-category/:path*', '/shop'),
      to('/mens-collections', '/shop/men'),
      to('/womens-collections', '/shop/women'),
      to('/all-products', '/shop'),
      to('/fragrance', '/shop'),
      to('/skin', '/shop'),
      to('/haircare', '/shop'),
      to('/shop/page/:n', '/shop'),

      // Pages.
      to('/about-us', '/our-story'),
      to('/contact-us', '/contact'),
      to('/refund_returns', '/shipping-returns'),
      to('/terms-conditions', '/terms'),
      to('/cart-2', '/cart'),
      to('/my-account/:path*', '/contact'),

      // WordPress leftovers with no equivalent.
      to('/hello-world', '/'),
      to('/category/:path*', '/'),
      to('/author/:path*', '/'),
      to('/feed/:path*', '/'),
      to('/wp-sitemap.xml', '/sitemap.xml'),
    ];
  },
};

export default nextConfig;
