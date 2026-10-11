'use client';

/** Parameters returned by the backend for Razorpay Checkout (no secrets). */
export type PaymentParams = {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
};

export type PaymentSuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

type RazorpayInstance = { open: () => void; on: (event: string, handler: (response: unknown) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let loading: Promise<void> | null = null;

/** Loads Razorpay Checkout on demand (only on the checkout / order pages). */
export function loadRazorpay() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error('Could not load the payment window. Please check your connection and try again.'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * Opens Razorpay Checkout. Resolves with the signed result on success, or
 * null if the customer closes the window without paying.
 */
export async function payWithRazorpay(params: PaymentParams): Promise<PaymentSuccess | null> {
  await loadRazorpay();
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: PaymentSuccess | null) => {
      if (!settled) {
        settled = true;
        resolve(value);
      }
    };
    const checkout = new window.Razorpay!({
      key: params.keyId,
      order_id: params.razorpayOrderId,
      amount: params.amount,
      currency: params.currency,
      name: params.name,
      description: params.description,
      prefill: params.prefill,
      theme: { color: '#16130f' },
      handler: (response: PaymentSuccess) => finish(response),
      modal: { ondismiss: () => finish(null), confirm_close: true },
    });
    // A failed attempt keeps the window open so the customer can retry another method.
    checkout.open();
  });
}
