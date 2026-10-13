import Image from 'next/image';
import { ProductArt } from '@/components/product/ProductArt';
import { artFor } from '@/lib/format';
import type { CartLine } from './cart-store';

export function LineThumb({ line, sizes }: { line: Pick<CartLine, 'image' | 'slug' | 'name'>; sizes: string }) {
  if (!line.image) return <ProductArt art={artFor(line.slug)} name={line.name} className="aspect-[4/5]" />;
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-surface">
      <Image src={line.image.src} alt="" fill sizes={sizes} quality={85} className="object-cover" />
    </div>
  );
}
