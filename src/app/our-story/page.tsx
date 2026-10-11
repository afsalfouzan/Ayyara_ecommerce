import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story behind Ayyara Rebirth — a house of refined eau de parfum.',
  alternates: { canonical: '/our-story' },
};

export default function OurStoryPage() {
  return (
    <ContentPage
      eyebrow="The house"
      title="Our story"
      intro="Ayyara Rebirth began with a simple belief: a fragrance should feel like a second skin — personal, quiet and unmistakably yours."
      path="/our-story"
      draft
    >
      <h2>A name with meaning</h2>
      <p>
        “Rebirth” speaks to renewal — the moment a familiar memory is transformed into something new.
        Each composition draws on that idea, pairing timeless materials with a modern sensibility.
      </p>
      <h2>Composed with restraint</h2>
      <p>
        We create a small collection rather than a large one, so every fragrance can be considered,
        refined and perfected before it reaches you.
      </p>
      <h2>Made to be worn</h2>
      <p>
        Our eau de parfums are designed for everyday elegance and memorable evenings alike — fragrances
        that evolve on the skin and stay with you.
      </p>
      <div className="mt-12">
        <ButtonLink href="/shop">Discover the collection</ButtonLink>
      </div>
    </ContentPage>
  );
}
