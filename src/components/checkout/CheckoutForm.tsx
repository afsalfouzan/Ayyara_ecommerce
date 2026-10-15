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
import { site } from '@/lib/site';
import { checkoutSchema } from '@/lib/validation/checkout';

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

  if (!ready) return <div className="mt-12 h-96 animate-pulse rounded-sm border border-line bg-surface" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-sm border border-line bg-surface py-24 px-6 text-center">
        <p className="text-3xl text-fg">Your bag is empty.</p>
        <p className="mt-3 text-mute">Discover our signature fragrances to begin.</p>
        <ButtonLink href="/shop" variant="primary" className="mt-8">
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
        if (error.code === 'INSUFFICIENT_STOCK' || error.code === 'ITEM_UNAVAILABLE') {
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
    <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-10 md:mt-8 lg:grid-cols-[1fr_23rem] lg:gap-14">
      <div className="space-y-10">
        <fieldset>
          <legend className="text-lg font-medium text-fg">Contact details</legend>
          <p className="mt-1 text-sm text-mute">We’ll send your order confirmation and tracking updates here.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <InputField id="email" label="Email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
            <InputField id="phone" label="Mobile number" type="tel" autoComplete="tel-national" inputMode="tel" required error={errors.phone} hint="10-digit Indian mobile number" />
          </div>
        </fieldset>

        <fieldset className="border-t border-line pt-8">
          <legend className="float-left w-full text-lg font-medium text-fg">Delivery address</legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            <InputField id="fullName" label="Full name" autoComplete="name" required error={errors.fullName} className="sm:col-span-2" />
            <InputField id="addressLine1" label="House / flat, street" autoComplete="address-line1" required error={errors.addressLine1} className="sm:col-span-2" />
            <InputField id="addressLine2" label="Area, landmark" autoComplete="address-line2" optional error={errors.addressLine2} className="sm:col-span-2" />
            <InputField id="city" label="City" autoComplete="address-level2" required error={errors.city} />
            <InputField id="pincode" label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} required error={errors.pincode} />
            {/* Only the states the shop delivers to; with one, it is already chosen. */}
            <SelectField id="state" label="State" autoComplete="address-level1" required options={site.policies.deliveryStates} placeholder="Select state" defaultValue={site.policies.deliveryStates.length === 1 ? site.policies.deliveryStates[0] : ''} hint={`We currently deliver only within ${site.policies.deliveryArea}.`} error={errors.state} className="sm:col-span-2" />
            <TextareaField id="notes" label="Delivery notes" optional maxLength={500} error={errors.notes} className="sm:col-span-2" />
          </div>
        </fieldset>
      </div>

      <aside aria-labelledby="checkout-summary" className="h-fit bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
        <h2 id="checkout-summary" className="text-lg font-medium text-fg">
          Your order
        </h2>
        {issues.length > 0 && <p className="mt-4 rounded-sm border border-line bg-gold-soft p-3 text-xs text-fg-soft">{issues.join(' ')}</p>}
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.variantId} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 text-sm">
              <LineThumb line={item} sizes="100px" />
              <div>
                <p className="text-sm leading-tight font-medium text-fg">{item.name}</p>
                <p className="text-xs text-mute mt-0.5">
                  {item.sizeMl} ml · Qty {item.quantity}
                </p>
              </div>
              <span className="tabular-nums text-fg font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-mute">Subtotal</dt>
            <dd className="tabular-nums text-fg">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mute">Delivery</dt>
            <dd className="text-fg">Free</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium text-fg border-t border-line">
            <dt>Total</dt>
            <dd className="tabular-nums text-lg">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        <Button type="submit" variant="primary" size="lg" className="mt-6 w-full" disabled={submitting}>
          <Lock className="size-3.5" strokeWidth={1.5} aria-hidden />
          {submitting ? 'Processing…' : 'Place order & pay'}
        </Button>
        <div role="alert" aria-live="assertive">
          {formError && <p className="mt-4 rounded-sm border border-danger/40 bg-danger/5 p-3 text-sm text-danger">{formError}</p>}
        </div>
        <p className="mt-4 text-center text-xs text-mute">Secure payment by Razorpay: UPI, cards and net banking. Your items are reserved for 30 minutes while you pay.</p>
      </aside>
    </form>
  );
}
