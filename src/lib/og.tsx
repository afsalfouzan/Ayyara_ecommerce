import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import { LOGO_FULL } from '@/components/brand/logo-paths';

/*
 * Preview cards shown when a link is shared on WhatsApp, Instagram, Facebook
 * or X. Drawn in the storefront's colours with the official logo; 1200 × 630
 * is the size every network accepts.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const ink = '#0e0e0e';
const gold = '#c9a96a';

export function OgLogo({ height }: { height: number }) {
  const [, , w, h] = LOGO_FULL.viewBox.split(' ').map(Number) as [number, number, number, number];
  return (
    <svg viewBox={LOGO_FULL.viewBox} width={(height * w) / h} height={height}>
      <path fill="#ffffff" fillRule="evenodd" d={LOGO_FULL.d} />
    </svg>
  );
}

export function ogCard(children: ReactNode) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: ink, backgroundImage: 'radial-gradient(circle at 25% 20%, #2a2520 0%, #0e0e0e 60%)', color: '#ffffff' }}>
        {children}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, backgroundColor: gold }} />
      </div>
    ),
    ogSize,
  );
}

export const og = { ink, gold };
