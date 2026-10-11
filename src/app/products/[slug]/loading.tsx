import { Container } from '@/components/ui/Container';

export default function ProductLoading() {
  return (
    <Container className="pt-6 pb-20 sm:pt-10" aria-busy="true" aria-label="Loading fragrance">
      <div className="h-4 w-48 animate-pulse bg-raised" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="aspect-[4/5] animate-pulse bg-surface" />
        <div className="space-y-5 lg:py-6">
          <div className="h-3 w-32 animate-pulse bg-raised" />
          <div className="h-14 w-3/4 animate-pulse bg-raised" />
          <div className="h-6 w-1/2 animate-pulse bg-raised" />
          <div className="mt-8 h-16 animate-pulse bg-surface" />
          <div className="h-13 animate-pulse bg-raised" />
        </div>
      </div>
    </Container>
  );
}
