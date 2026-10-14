import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { isLiveSite, site } from '@/lib/site';
import './globals.css';

/** Ayyara Rebirth's own typeface, used for everything: titles, body text, navigation, buttons and forms. */
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Fine Fragrances For Modern You`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: 'summary_large_image' },
  robots: isLiveSite ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#f8f6f1',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className={`${poppins.variable} antialiased`}>
      {/* The extra space at the bottom on phones keeps the footer clear of the fixed bar of shortcuts. */}
      <body className="flex min-h-dvh flex-col pb-[calc(4rem+env(safe-area-inset-bottom,0px))] font-sans text-fg antialiased md:pb-0">
        <a
          href="#main"
          className="label sr-only z-[60] bg-fg px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
