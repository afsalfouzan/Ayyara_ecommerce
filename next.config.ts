import type { NextConfig } from 'next';

// Images from a backend on this machine (development, or a production build tested
// locally). A real deployment's API is never on localhost, so the SSRF guard stays on there.
const localApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(process.env.NEXT_PUBLIC_API_URL ?? '');

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
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  /**
   * Permanent redirects from the old WooCommerce URL structure so existing
   * search rankings and shared links carry over. Extend this list with the
   * exact URLs exported from the current site before launch.
   */
  async redirects() {
    return [
      { source: '/product/:slug', destination: '/products/:slug', permanent: true },
      { source: '/product-category/:path*', destination: '/shop', permanent: true },
      { source: '/shop/page/:n', destination: '/shop', permanent: true },
      { source: '/cart-2', destination: '/cart', permanent: true },
      { source: '/my-account/:path*', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/our-story', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/refund_returns', destination: '/shipping-returns', permanent: true },
    ];
  },
};

export default nextConfig;
