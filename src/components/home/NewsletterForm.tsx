'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/icons';
import { storeApi, StoreApiError } from '@/lib/api';

const plainField = 'w-full appearance-none rounded-md border border-white/15 bg-[#141414] px-4 py-3.5 text-sm text-white placeholder:text-stone-500 transition-colors focus:border-white focus:ring-0 focus:outline-none';

const circleField = 'w-full appearance-none rounded-xl bg-[#353534] px-3.5 py-3 text-[13px] md:px-4 md:py-3.5 md:text-sm text-[#e5e2e1] placeholder:text-[#8e918f] transition-colors focus:bg-[#3a3939] focus:ring-0 focus:outline-none';

/**
 * "Stay Updated" sign-up: first name, last name (optional) and email.
 * `look="circle"` is the home page's "Private Circle" card.
 */
export function NewsletterForm({ look = 'plain' }: { look?: 'plain' | 'circle' }) {
  const circle = look === 'circle';
  const field = circle ? circleField : plainField;
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState('sending');
    setError(null);
    try {
      await storeApi('/store/newsletter', {
        method: 'POST',
        json: { firstName: String(data.get('firstName') ?? ''), lastName: String(data.get('lastName') ?? ''), email: String(data.get('email') ?? '') },
      });
      setState('done');
    } catch (err) {
      setError(err instanceof StoreApiError ? err.message : 'Something went wrong. Please try again.');
      setState('idle');
    }
  }

  if (state === 'done' && circle) {
    return (
      <div role="status" className="py-6 text-center">
        <Icon name="badgeCheck" className="mx-auto h-8 w-8 text-champagne" />
        <p className="mt-2 font-playfair text-[22px] leading-[30px] font-medium text-white">Welcome to The Circle</p>
        <p className="mt-1 text-[13px] leading-5 text-mist">Thank you. We’ll be in touch with launches and exclusive offers.</p>
      </div>
    );
  }

  if (state === 'done') {
    return (
      <p role="status" className="flex items-center gap-3 rounded-md border border-white/15 bg-[#141414] px-4 py-5 text-sm text-stone-300">
        <Icon name="check" strokeWidth={2} className="h-5 w-5 shrink-0 text-amber-300" />
        Thank you — you’re on the list. We’ll be in touch with launches and exclusive offers.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={circle ? 'space-y-3 md:space-y-4' : 'space-y-4'} noValidate={false}>
      <div className={circle ? 'grid grid-cols-2 gap-3 md:gap-4' : 'grid grid-cols-1 gap-4 sm:grid-cols-2'}>
        <div>
          <label htmlFor="nl-first" className="sr-only">
            First name
          </label>
          <input id="nl-first" name="firstName" required maxLength={80} autoComplete="given-name" placeholder={circle ? 'First Name' : 'First name'} className={field} />
        </div>
        <div>
          <label htmlFor="nl-last" className="sr-only">
            Last name
          </label>
          <input id="nl-last" name="lastName" maxLength={80} autoComplete="family-name" placeholder={circle ? 'Last Name' : 'Last name'} className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="nl-email" className="sr-only">
          Email
        </label>
        <input id="nl-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder={circle ? 'Email Address' : 'Email'} className={field} />
      </div>
      <div role="alert" aria-live="assertive">
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>
      {circle ? (
        <>
          <button type="submit" disabled={state === 'sending'} className="btn-champagne mt-2 w-full rounded-xl py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase md:py-4 md:text-xs" data-purpose="form-submit">
            <span className="relative z-10">{state === 'sending' ? 'Sending…' : 'Join the Private Circle'}</span>
          </button>
          <p className="pt-1 text-center text-[10px] tracking-wide text-sand md:text-[11px]">Your details stay private. Unsubscribe at any time.</p>
        </>
      ) : (
      <div className="pt-2">
        <button type="submit" disabled={state === 'sending'} className="inline-block px-1 py-2 text-left text-sm font-normal tracking-wide text-white transition-all hover:text-amber-200 hover:underline disabled:opacity-60" data-purpose="form-submit">
          {state === 'sending' ? 'Sending…' : 'Stay Updated'}
        </button>
      </div>
      )}
    </form>
  );
}
