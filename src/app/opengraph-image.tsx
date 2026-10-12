import { og, ogCard, ogContentType, OgLogo, ogSize } from '@/lib/og';
import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

/** Default share card for every page that has no card of its own. */
export default function Image() {
  return ogCard(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <OgLogo height={250} />
      <div style={{ marginTop: 54, width: 72, height: 2, backgroundColor: og.gold }} />
      <div style={{ marginTop: 40, fontSize: 34, letterSpacing: 12, textTransform: 'uppercase' }}>Fine Fragrances</div>
      <div style={{ marginTop: 14, fontSize: 28, color: '#d6d3d1' }}>For modern you</div>
    </div>,
  );
}
