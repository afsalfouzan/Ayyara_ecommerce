'use client';

import { useState } from 'react';

/** "Share": opens the device's share sheet, or copies the page's address where there isn't one. */
export function ShareLink({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // The visitor closed the share sheet, or the browser refused to copy; nothing to do.
    }
  }

  return (
    <div className="flex items-center gap-4 py-6">
      <button type="button" onClick={share} className="inline-flex items-center gap-2 text-sm text-fg-soft transition-colors duration-300 hover:text-fg">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 15V4m0 0L8 8m4-4l4 4M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6" />
        </svg>
        Share
      </button>
      <span role="status" aria-live="polite" className="text-xs text-mute">
        {copied ? 'Link copied' : ''}
      </span>
    </div>
  );
}
