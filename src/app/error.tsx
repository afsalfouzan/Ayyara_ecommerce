'use client';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container size="narrow" className="py-28 text-center sm:py-36">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 text-4xl text-fg md:text-6xl">We couldn’t load this page.</h1>
      <p className="mt-5 text-mute">Please try again. If the problem continues, contact our client care team.</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">
          Return home
        </ButtonLink>
      </div>
    </Container>
  );
}
