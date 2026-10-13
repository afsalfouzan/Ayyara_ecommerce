'use client';

import { clsx } from 'clsx';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import { storeApi, StoreApiError } from '@/lib/api';

const TOPICS = [
  { value: 'consultation', label: 'Choosing a fragrance' },
  { value: 'order', label: 'An order' },
  { value: 'gifting', label: 'Gifting' },
  { value: 'general', label: 'Something else' },
] as const;
type Topic = (typeof TOPICS)[number]['value'];

const field = 'field';
const label = 'mb-1.5 block text-[13px] font-medium text-fg';

/**
 * "Send a Message": the message goes to the shop's inbox through the backend.
 * The confirmation appears only once the backend says it was sent; otherwise
 * the customer sees why not and can correct the form or use the phone number.
 */
export function ContactForm() {
  const [topic, setTopic] = useState<Topic>('consultation');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    setState('sending');
    setError(null);
    setFieldErrors({});
    try {
      await storeApi('/store/contact', {
        method: 'POST',
        json: { topic, name: text('name'), email: text('email'), phone: text('phone') || undefined, orderNumber: text('orderNumber') || undefined, message: text('message'), website: text('website') || undefined },
      });
      setState('done');
    } catch (err) {
      const details = err instanceof StoreApiError ? (err.details as { fieldErrors?: Record<string, string[]> } | undefined) : undefined;
      const perField = Object.fromEntries(Object.entries(details?.fieldErrors ?? {}).flatMap(([key, messages]) => (messages[0] ? [[key, messages[0]]] : [])));
      setFieldErrors(perField);
      setError(Object.keys(perField).length ? 'Please check the highlighted fields.' : err instanceof StoreApiError ? err.message : 'Something went wrong. Please try again.');
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-success">
          <Icon name="check" strokeWidth={2} className="h-6 w-6" />
        </span>
        <p className="mt-4 text-xl font-medium text-fg">Message sent</p>
        <p className="mt-1 max-w-xs text-sm text-fg-soft">Thank you. We’ll reply to your email within one working day.</p>
      </div>
    );
  }

  const errorFor = (name: string) => fieldErrors[name] && <p className="mt-1 text-xs text-danger">{fieldErrors[name]}</p>;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <fieldset>
        <legend className={label}>What is it about?</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={topic === option.value}
              onClick={() => setTopic(option.value)}
              className={clsx('rounded-[2px] border px-3 py-2 text-[13px] transition-colors', topic === option.value ? 'border-fg bg-fg text-canvas' : 'border-line bg-canvas text-fg hover:border-fg')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="contact-name" className={label}>
          Full name *
        </label>
        <input id="contact-name" name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} aria-invalid={Boolean(fieldErrors.name)} />
        {errorFor('name')}
      </div>
      <div>
        <label htmlFor="contact-email" className={label}>
          Email address *
        </label>
        <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} aria-invalid={Boolean(fieldErrors.email)} />
        {errorFor('email')}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={label}>
            Phone number <span className="font-normal text-mute">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={20} autoComplete="tel" placeholder="+91 00000 00000" className={field} aria-invalid={Boolean(fieldErrors.phone)} />
          {errorFor('phone')}
        </div>
        <div>
          <label htmlFor="contact-order" className={label}>
            Order number <span className="font-normal text-mute">(if applicable)</span>
          </label>
          <input id="contact-order" name="orderNumber" maxLength={24} autoComplete="off" placeholder="AR-13OCT26-07" className={clsx(field, 'uppercase placeholder:normal-case')} aria-invalid={Boolean(fieldErrors.orderNumber)} />
          {errorFor('orderNumber')}
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={label}>
          Your message *
        </label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={5} placeholder="How may we help you?" className={clsx(field, 'resize-y')} aria-invalid={Boolean(fieldErrors.message)} />
        {errorFor('message')}
      </div>

      {/* A trap for scripts that fill in every field. People never see or reach it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div role="alert" aria-live="assertive">
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
      <Button type="submit" size="lg" disabled={state === 'sending'} className="w-full sm:w-fit">
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
