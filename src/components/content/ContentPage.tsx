import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';

/** Editorial layout for informational and policy pages. */
export function ContentPage({
  eyebrow,
  title,
  intro,
  path,
  draft,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  path: string;
  /** Marks placeholder copy that must be replaced/approved before launch. */
  draft?: boolean;
  children: ReactNode;
}) {
  return (
    <Container size="narrow" className="pt-8 pb-24 sm:pt-12">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: title, href: path },
        ]}
      />
      <header className="mt-12 border-b border-line pb-10">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-5xl leading-[1.05] sm:text-6xl">{title}</h1>
        {intro && <p className="mt-6 text-lg leading-relaxed text-mute">{intro}</p>}
      </header>
      {draft && process.env.NODE_ENV !== 'production' && (
        <p className="mt-8 border border-gold/60 bg-gold-soft/50 p-4 text-sm text-fg-soft">
          <strong className="label block text-gold-bright">Draft copy</strong>
          Placeholder text — to be replaced with content approved by Ayyara Rebirth before launch.
        </p>
      )}
      <div className="prose-luxe mt-10">{children}</div>
    </Container>
  );
}
