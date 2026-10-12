'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cart, useCart } from '@/components/cart/cart-store';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { stockLabel } from '@/lib/format';
import type { Product } from '@/lib/types';

/** Size selector, price, stock and "Add to bag" for a product page. */
export function VariantPicker({ product }: { product: Pick<Product, 'id' | 'slug' | 'name' | 'images' | 'variants'> }) {
  const { items } = useCart();
  const firstAvailable = product.variants.find((v) => v.stockStatus !== 'out_of_stock') ?? product.variants[0]!;
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const inBag = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const remaining = Math.max(0, variant.purchasableQuantity - inBag);
  const soldOut = variant.stockStatus === 'out_of_stock' || variant.purchasableQuantity === 0;

  function add() {
    cart.add(
      {
        variantId: variant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sizeMl: variant.sizeMl,
        unitPrice: variant.pricePaise,
        mrp: variant.mrpPaise,
        maxQuantity: variant.purchasableQuantity,
        image: product.images[0] ?? null,
      },
      quantity,
    );
    setQuantity(1);
    setAdded(true);
  }

  const tone = { in_stock: 'bg-success', low_stock: 'bg-gold', out_of_stock: 'bg-danger' }[variant.stockStatus];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
        <Price price={variant.pricePaise} mrp={variant.mrpPaise} className="text-xl" />
        <span className="inline-flex items-center gap-2 text-sm text-fg-soft">
          <span aria-hidden className={`size-1.5 rounded-full ${tone}`} />
          {stockLabel[variant.stockStatus]}
        </span>
      </div>

      {product.variants.length > 0 && (
        <fieldset>
          <legend className="label mb-3 text-fg">Size</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((option) => {
              const out = option.stockStatus === 'out_of_stock';
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={option.id === variant.id}
                  onClick={() => {
                    setVariantId(option.id);
                    setQuantity(1);
                    setAdded(false);
                  }}
                  className={clsx(
                    'min-w-24 rounded-sm border px-4 py-2.5 text-left transition-all duration-200',
                    option.id === variant.id
                      ? 'border-[#c5a059] bg-[#c5a059]/15 text-white ring-1 ring-[#c5a059]'
                      : 'border-white/10 bg-[#141414] text-stone-300 hover:border-white/30',
                    out && option.id !== variant.id && 'text-stone-600 line-through decoration-1',
                  )}
                >
                  <span className="block text-sm font-medium">{option.sizeMl} ml</span>
                  <span className={clsx('block text-xs tabular-nums', option.id === variant.id ? 'text-[#c5a059]' : 'text-stone-400')}>
                    {out ? 'Sold out' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(option.pricePaise / 100)}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {soldOut ? (
        <div className="space-y-3">
          <Button size="lg" disabled className="w-full">
            Sold out
          </Button>
          <p className="text-sm text-stone-400">This size is currently unavailable. {product.variants.length > 1 ? 'Try another size or check back soon.' : 'Please check back soon.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <QuantityStepper label="Quantity" value={Math.min(quantity, Math.max(1, remaining))} max={Math.max(1, remaining)} onChange={setQuantity} />
            <Button variant="gold" size="lg" onClick={add} disabled={remaining === 0} className="flex-1 font-medium tracking-widest uppercase">
              {remaining === 0 ? 'Maximum in bag' : 'Add to bag'}
            </Button>
          </div>
          <p role="status" aria-live="polite" className="min-h-5 text-sm">
            {added && (
              <span className="inline-flex animate-fade-up items-center gap-2 text-emerald-400">
                <Check className="size-4" strokeWidth={1.5} />
                Added to your bag.
                <Link href="/cart" className="text-white underline underline-offset-4 hover:text-[#c5a059]">
                  View bag
                </Link>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
