'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import { storeApi, StoreApiError } from '@/lib/api';

/** "Stay updated" sign-up: first name, last name (optional) and email. */
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
      <p role="status" className="flex items-center gap-3 border border-line bg-canvas px-4 py-4 text-sm text-fg">
        <Icon name="check" strokeWidth={2} className="h-5 w-5 shrink-0 text-success" />
        Thank you. You’re on the list, and we’ll be in touch with launches and offers.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="nl-first" className="sr-only">
            First name
          </label>
          <input id="nl-first" name="firstName" required maxLength={80} autoComplete="given-name" placeholder="First name" className="field" />
        </div>
        <div>
          <label htmlFor="nl-last" className="sr-only">
            Last name
          </label>
          <input id="nl-last" name="lastName" maxLength={80} autoComplete="family-name" placeholder="Last name" className="field" />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="nl-email" className="sr-only">
            Email
          </label>
          <input id="nl-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="Email address" className="field" />
        </div>
        <Button type="submit" disabled={state === 'sending'} className="h-auto min-h-11 sm:px-8" data-purpose="form-submit">
          {state === 'sending' ? 'Sending…' : 'Subscribe'}
        </Button>
      </div>
      <div role="alert" aria-live="assertive">
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
      <p className="text-xs text-mute">Your details stay private. Unsubscribe at any time.</p>
    </form>
  );
}
