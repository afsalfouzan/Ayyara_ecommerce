import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container size="narrow" className="py-28 text-center sm:py-36">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 text-5xl sm:text-6xl">This page has evaporated.</h1>
      <p className="mt-5 text-mute">The page you are looking for may have moved or no longer exists.</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop">Shop the collection</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Return home
        </ButtonLink>
      </div>
    </Container>
  );
}
