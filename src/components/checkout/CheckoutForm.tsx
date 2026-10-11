'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { cart, useCart } from '@/components/cart/cart-store';
import { LineThumb } from '@/components/cart/LineThumb';
import { useQuote } from '@/components/cart/useQuote';
import { Button, ButtonLink } from '@/components/ui/Button';
import { InputField, SelectField, TextareaField } from '@/components/ui/Field';
import { storeApi, StoreApiError } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { payWithRazorpay, type PaymentParams } from '@/lib/razorpay';
import { checkoutSchema, INDIAN_STATES } from '@/lib/validation/checkout';

type Errors = Partial<Record<keyof z.input<typeof checkoutSchema>, string>>;

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, ready } = useCart();
  const { issues } = useQuote();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // One id per checkout attempt (created on first submit): double-clicks and retries return the same order.
  const checkoutId = useRef<string | null>(null);

  if (!ready) return <div className="mt-12 h-96 animate-pulse bg-surface" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="mt-12 border-y border-line py-24 text-center">
        <p className="font-display text-3xl">Your bag is empty.</p>
        <ButtonLink href="/shop" className="mt-8">
          Shop the collection
        </ButtonLink>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = checkoutSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]])) as Errors);
      const first = Object.keys(fieldErrors)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);
    checkoutId.current ??= crypto.randomUUID();
    try {
      const order = await storeApi<{ orderNumber: string; accessToken: string | null; payment: PaymentParams | null }>('/store/orders', {
        method: 'POST',
        json: { ...result.data, checkoutId: checkoutId.current, items: items.map(({ variantId, quantity }) => ({ variantId, quantity })) },
      });
      cart.clear();
      if (!order.accessToken) {
        // A retry of an order that was already placed (e.g. after a timeout).
        router.push(`/order/${order.orderNumber}`);
        return;
      }
      const orderUrl = `/order/${order.orderNumber}?t=${encodeURIComponent(order.accessToken)}`;
      if (order.payment) {
        const paid = await payWithRazorpay(order.payment).catch(() => null);
        if (paid) {
          // The order page shows the result; the webhook confirms it too if this call is interrupted.
          await storeApi(`/store/orders/${order.orderNumber}/verify`, {
            method: 'POST',
            json: { token: order.accessToken, razorpayOrderId: paid.razorpay_order_id, razorpayPaymentId: paid.razorpay_payment_id, razorpaySignature: paid.razorpay_signature },
          }).catch(() => undefined);
          router.push(`${orderUrl}&paid=1`);
          return;
        }
      }
      router.push(orderUrl);
    } catch (error) {
      setSubmitting(false);
      if (error instanceof StoreApiError) {
        if (error.code === 'INSUFFICIENT_STOCK' || error.code === 'ITEM_UNAVAILABLE' || error.code === 'QUANTITY_LIMIT') {
          // Stock changed: start a fresh checkout so the corrected bag gets a new order.
          checkoutId.current = null;
          setFormError('Some items in your bag just sold out or changed. Please review your bag and try again.');
          return;
        }
        const details = (error.details as { fieldErrors?: Record<string, string[]> } | undefined)?.fieldErrors;
        if (details) {
          setErrors(Object.fromEntries(Object.entries(details).map(([key, messages]) => [key, messages[0]])) as Errors);
          return;
        }
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div className="space-y-12">
        <fieldset>
          <legend className="font-display text-3xl">Contact</legend>
          <p className="mt-2 text-sm text-mute">We’ll send your order confirmation and updates here.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField id="email" label="Email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
            <InputField id="phone" label="Mobile number" type="tel" autoComplete="tel-national" inputMode="tel" required error={errors.phone} hint="10-digit Indian mobile number" />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-3xl">Delivery address</legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField id="fullName" label="Full name" autoComplete="name" required error={errors.fullName} className="sm:col-span-2" />
            <InputField id="addressLine1" label="House / flat, street" autoComplete="address-line1" required error={errors.addressLine1} className="sm:col-span-2" />
            <InputField id="addressLine2" label="Area, landmark" autoComplete="address-line2" optional error={errors.addressLine2} className="sm:col-span-2" />
            <InputField id="city" label="City" autoComplete="address-level2" required error={errors.city} />
            <InputField id="pincode" label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} required error={errors.pincode} />
            <SelectField id="state" label="State" autoComplete="address-level1" required options={INDIAN_STATES} placeholder="Select state" defaultValue="" error={errors.state} className="sm:col-span-2" />
            <TextareaField id="notes" label="Delivery notes" optional maxLength={500} error={errors.notes} className="sm:col-span-2" />
          </div>
        </fieldset>
      </div>

      <aside aria-labelledby="checkout-summary" className="h-fit bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
        <h2 id="checkout-summary" className="text-2xl">
          Your order
        </h2>
        {issues.length > 0 && <p className="mt-4 border border-gold/50 bg-gold-soft/40 p-3 text-xs text-fg-soft">{issues.join(' ')}</p>}
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.variantId} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 text-sm">
              <LineThumb line={item} sizes="56px" />
              <div>
                <p className="font-display text-lg leading-tight">{item.name}</p>
                <p className="text-mute">
                  {item.sizeMl} ml · Qty {item.quantity}
                </p>
              </div>
              <span className="tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-mute">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mute">Delivery</dt>
            <dd>Free</dd>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" className="mt-8 w-full" disabled={submitting}>
          <Lock className="size-3.5" strokeWidth={1.5} aria-hidden />
          {submitting ? 'Processing…' : 'Place order & pay'}
        </Button>
        <div role="alert" aria-live="assertive">
          {formError && <p className="mt-4 border border-danger/40 bg-danger/5 p-3 text-sm text-danger">{formError}</p>}
        </div>
        <p className="mt-4 text-center text-xs text-mute">Secure payment by Razorpay — UPI, cards, net banking. Your items are reserved for 30 minutes while you pay.</p>
      </aside>
    </form>
  );
}
