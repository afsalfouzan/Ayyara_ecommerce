'use client';

import { CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { storeApi, StoreApiError } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { payWithRazorpay, type PaymentParams } from '@/lib/razorpay';

type Order = {
  orderNumber: string;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'expired';
  paymentStatus: string;
  fulfilmentStatus: string;
  placedAt: string;
  reservationExpiresAt: string | null;
  email: string;
  shipping: { name: string; city: string; state: string; pincode: string };
  items: { productName: string; sizeMl: number; quantity: number; unitPricePaise: number; lineTotalPaise: number }[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  courier: string | null;
  trackingNumber: string | null;
  canPay: boolean;
};

export function OrderStatus({ orderNumber }: { orderNumber: string }) {
  const search = useSearchParams();
  const token = search.get('t');
  const justPaid = search.get('paid') === '1';
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(token ? null : 'missing');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return null;
    try {
      const data = await storeApi<{ order: Order }>(`/store/orders/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`);
      setOrder(data.order);
      return data.order;
    } catch (e) {
      setError(e instanceof StoreApiError && e.status === 404 ? 'not_found' : 'failed');
      return null;
    }
  }, [orderNumber, token]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    // Right after paying, the confirmation may still be on its way (webhook) — check a few times.
    const poll = async () => {
      const current = await load();
      if (!cancelled && justPaid && current?.status === 'pending_payment' && attempts++ < 10) setTimeout(poll, 3000);
    };
    void poll();
    return () => {
      cancelled = true;
    };
  }, [load, justPaid]);

  async function payNow() {
    if (!token || !order) return;
    setPaying(true);
    setPayError(null);
    try {
      const { payment } = await storeApi<{ payment: PaymentParams }>(`/store/orders/${encodeURIComponent(orderNumber)}/pay`, { method: 'POST', json: { token } });
      const paid = await payWithRazorpay(payment);
      if (paid) {
        await storeApi(`/store/orders/${encodeURIComponent(orderNumber)}/verify`, {
          method: 'POST',
          json: { token, razorpayOrderId: paid.razorpay_order_id, razorpayPaymentId: paid.razorpay_payment_id, razorpaySignature: paid.razorpay_signature },
        }).catch(() => undefined);
        await load();
      }
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Payment could not be started. Please try again.');
      await load();
    } finally {
      setPaying(false);
    }
  }

  if (error) {
    return (
      <div className="mt-10 rounded-sm border border-white/10 bg-[#141414] py-16 px-6 text-center shadow-xl">
        <p className="font-serif text-3xl font-light text-white">{error === 'missing' ? 'Your order has been received.' : 'We couldn’t open this order.'}</p>
        <p className="mx-auto mt-4 max-w-md text-stone-400">
          {error === 'missing'
            ? `Your order number is ${orderNumber}. Use the link in your confirmation email to see its status.`
            : 'Please use the link from your confirmation email, or contact us with your order number.'}
        </p>
        <ButtonLink href="/contact" variant="outline" className="mt-8">
          Contact us
        </ButtonLink>
      </div>
    );
  }

  if (!order) return <div className="mt-10 h-96 animate-pulse rounded-sm border border-white/10 bg-[#141414]" aria-busy="true" aria-label="Loading order" />;

  const state = describe(order);
  const Icon = state.icon;

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <div className="space-y-8">
        <div className="flex gap-5 rounded-sm border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-xl">
          <Icon className={`mt-1 size-8 shrink-0 ${state.tone}`} strokeWidth={1.5} aria-hidden />
          <div className="flex-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-white">{state.title}</h2>
            <p className="mt-2 max-w-lg leading-relaxed text-stone-300 text-sm">{state.body}</p>
            {order.status === 'pending_payment' && order.canPay && (
              <div className="mt-6 space-y-3">
                {justPaid && <p className="text-sm text-[#c5a059]">Confirming your payment with the bank… this page updates automatically.</p>}
                <Button variant="gold" size="lg" onClick={payNow} disabled={paying}>
                  {paying ? 'Opening secure payment…' : `Pay ${formatPrice(order.totalPaise)} now`}
                </Button>
                <p className="text-xs text-stone-500">
                  Items held until {order.reservationExpiresAt ? new Date(order.reservationExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'the reservation ends'}. Secure payment by Razorpay.
                </p>
                {payError && <p className="text-sm text-rose-400">{payError}</p>}
              </div>
            )}
            {order.status === 'pending_payment' && !order.canPay && (
              <p className="mt-4 rounded-sm border border-[#c5a059]/40 bg-[#c5a059]/10 p-3 text-sm text-stone-200">
                <strong className="label block text-[#c5a059]">Development build</strong>
                Online payment (Razorpay) is not configured on this server, so no payment has been taken.
              </p>
            )}
            {order.trackingNumber && (
              <p className="mt-4 text-sm text-stone-300">
                {order.courier} · tracking <strong className="text-white">{order.trackingNumber}</strong>
              </p>
            )}
          </div>
        </div>

        <section aria-labelledby="delivery-heading" className="rounded-sm border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-xl">
          <h2 id="delivery-heading" className="font-serif text-2xl font-light text-white border-b border-white/10 pb-3">
            Delivery to
          </h2>
          <p className="mt-4 text-stone-300 text-sm leading-relaxed">
            <span className="font-medium text-white">{order.shipping.name}</span>
            <br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.pincode}
          </p>
          <p className="mt-3 text-xs text-stone-500">Updates will be sent to {order.email}.</p>
        </section>
      </div>

      <aside className="h-fit rounded-sm border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-xl lg:sticky lg:top-28">
        <p className="label text-[#c5a059]">Order {order.orderNumber}</p>
        <ul className="mt-5 space-y-3 text-sm">
          {order.items.map((item) => (
            <li key={`${item.productName}-${item.sizeMl}`} className="flex justify-between gap-4 text-stone-300">
              <span>
                {item.productName} · {item.sizeMl} ml × {item.quantity}
              </span>
              <span className="tabular-nums text-white font-medium">{formatPrice(item.lineTotalPaise)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-400">Delivery</dt>
            <dd className="text-emerald-400 font-medium">{order.shippingPaise ? formatPrice(order.shippingPaise) : 'Free'}</dd>
          </div>
          <div className="flex justify-between text-base font-medium text-white pt-2 border-t border-white/5">
            <dt>Total</dt>
            <dd className="tabular-nums text-lg">{formatPrice(order.totalPaise)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function describe(order: Order) {
  if (order.status === 'cancelled') return { icon: XCircle, tone: 'text-rose-400', title: 'This order was cancelled', body: 'If you were charged, a refund is on its way to your original payment method.' };
  if (order.status === 'expired') return { icon: XCircle, tone: 'text-stone-500', title: 'Payment time ran out', body: 'We didn’t receive payment in time, so the items were released. You can place the order again from the shop.' };
  if (order.status === 'pending_payment') return { icon: Clock, tone: 'text-[#c5a059]', title: 'Order received — awaiting payment', body: 'Your items are reserved. Once payment is confirmed we will start preparing your order.' };
  if (order.fulfilmentStatus === 'delivered') return { icon: CheckCircle2, tone: 'text-emerald-400', title: 'Delivered', body: 'We hope you love your fragrance.' };
  if (order.fulfilmentStatus === 'dispatched') return { icon: Truck, tone: 'text-emerald-400', title: 'On its way', body: 'Your order has been dispatched.' };
  if (order.fulfilmentStatus === 'packed' || order.fulfilmentStatus === 'processing') return { icon: Package, tone: 'text-emerald-400', title: 'Being prepared', body: 'We are carefully packing your order.' };
  return { icon: CheckCircle2, tone: 'text-emerald-400', title: 'Thank you — payment received', body: 'Your order is confirmed. We will email you when it is dispatched.' };
}
