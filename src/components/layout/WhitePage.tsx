import type { ReactNode } from 'react';

/**
 * The perfume pages (the shop, its collections and each perfume's page) sit on white instead of the site's ivory.
 * The palette is switched for everything inside (see .theme-white in globals.css), so every element that follows
 * the page colour follows it. The minimum height keeps a short page white right down to the footer.
 */
export function WhitePage({ children }: { children: ReactNode }) {
  return <div className="theme-white min-h-[calc(100svh-5rem)] bg-canvas">{children}</div>;
}
