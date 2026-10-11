'use client';

import { Minus, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
  size = 'md',
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 'h-9' : 'h-11';
  return (
    <div
      role="group"
      aria-label={label}
      className={clsx('inline-flex items-center border border-line bg-canvas', h)}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={clsx('grid aspect-square place-items-center text-fg disabled:text-line', h)}
      >
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={clsx('grid aspect-square place-items-center text-fg disabled:text-line', h)}
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
