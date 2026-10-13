import Image from 'next/image';
import { clsx } from 'clsx';
import { artFor } from '@/lib/format';
import type { ProductImage } from '@/lib/types';
import { ProductArt } from './ProductArt';

/** A product photo if uploaded, otherwise the illustrated bottle. */
export function ProductMedia({
  product,
  image,
  priority = false,
  sizes,
  className,
}: {
  product: { name: string; slug: string; images: ProductImage[] };
  image?: ProductImage;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const photo = image ?? product.images[0];
  if (!photo) {
    return <ProductArt art={artFor(product.slug)} name={product.name} className={clsx('aspect-[4/5]', className)} />;
  }
  return (
    <div className={clsx('relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 bg-[#181818]', className)}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} quality={85} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="object-cover" />
    </div>
  );
}
