'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/icons';
import { storeApi, StoreApiError } from '@/lib/api';

const field = 'w-full appearance-none rounded-md border border-white/15 bg-[#141414] px-4 py-3.5 text-sm text-white placeholder:text-stone-500 transition-colors focus:border-white focus:ring-0 focus:outline-none';

/** "Stay Updated" sign-up: first name, last name (optional) and email. */
export function NewsletterForm() {
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

  if (state === 'done') {
    return (
      <p role="status" className="flex items-center gap-3 rounded-md border border-white/15 bg-[#141414] px-4 py-5 text-sm text-stone-300">
        <Icon name="check" strokeWidth={2} className="h-5 w-5 shrink-0 text-amber-300" />
        Thank you — you’re on the list. We’ll be in touch with launches and exclusive offers.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nl-first" className="sr-only">
            First name
          </label>
          <input id="nl-first" name="firstName" required maxLength={80} autoComplete="given-name" placeholder="First name" className={field} />
        </div>
        <div>
          <label htmlFor="nl-last" className="sr-only">
            Last name
          </label>
          <input id="nl-last" name="lastName" maxLength={80} autoComplete="family-name" placeholder="Last name" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="nl-email" className="sr-only">
          Email
        </label>
        <input id="nl-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="Email" className={field} />
      </div>
      <div role="alert" aria-live="assertive">
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>
      <div className="pt-2">
        <button type="submit" disabled={state === 'sending'} className="inline-block px-1 py-2 text-left text-sm font-normal tracking-wide text-white transition-all hover:text-amber-200 hover:underline disabled:opacity-60" data-purpose="form-submit">
          {state === 'sending' ? 'Sending…' : 'Stay Updated'}
        </button>
      </div>
    </form>
  );
}
