import { clsx } from 'clsx';
import { useId } from 'react';
/** Bottle colours for the illustration. */
export type Art = { liquid: string; backdrop: string };

/**
 * Illustrated bottle shown until real product photography is uploaded.
 * Decorative: the surrounding UI always carries the product name.
 */
export function ProductArt({
  art,
  name,
  className,
}: {
  art: Art;
  name: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <div
      className={clsx('relative overflow-hidden', className)}
      style={{ backgroundColor: art.backdrop }}
    >
      <svg viewBox="0 0 400 500" className="h-full w-full" role="img" aria-label={`${name} bottle`}>
        <defs>
          <linearGradient id={`glass-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor={art.liquid} stopOpacity="0.95" />
            <stop offset="0.55" stopColor={art.liquid} stopOpacity="0.78" />
            <stop offset="1" stopColor={art.liquid} stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`cap-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#8a6a35" />
            <stop offset="0.35" stopColor="#e2c891" />
            <stop offset="0.6" stopColor="#b4935a" />
            <stop offset="1" stopColor="#7d5f2e" />
          </linearGradient>
          <radialGradient id={`glow-${id}`} cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#glow-${id})`} />
        <ellipse cx="200" cy="440" rx="120" ry="10" fill="#16130f" opacity="0.12" />

        {/* cap + collar */}
        <rect x="160" y="78" width="80" height="78" rx="3" fill={`url(#cap-${id})`} />
        <rect x="176" y="156" width="48" height="16" fill="#cdb27c" />

        {/* bottle */}
        <rect x="104" y="170" width="192" height="266" rx="14" fill="#ffffff" fillOpacity="0.35" />
        <rect x="112" y="178" width="176" height="250" rx="10" fill={`url(#glass-${id})`} />
        <rect x="124" y="186" width="10" height="234" rx="5" fill="#ffffff" opacity="0.28" />
        <rect x="270" y="186" width="4" height="234" rx="2" fill="#ffffff" opacity="0.18" />

        {/* label */}
        <rect x="146" y="268" width="108" height="72" fill="#f8f4ec" opacity="0.94" />
        <rect x="150" y="272" width="100" height="64" fill="none" stroke="#b4935a" strokeWidth="0.75" />
        <text
          x="200"
          y="300"
          textAnchor="middle"
          fontFamily="var(--font-display), sans-serif"
          fontSize="15"
          letterSpacing="4"
          fill="#16130f"
        >
          AYYARA
        </text>
        <text
          x="200"
          y="320"
          textAnchor="middle"
          fontFamily="var(--font-jost), sans-serif"
          fontSize="6.5"
          letterSpacing="2.5"
          fill="#7d5f2e"
        >
          EXTRAIT DE PARFUM
        </text>
      </svg>
    </div>
  );
}
