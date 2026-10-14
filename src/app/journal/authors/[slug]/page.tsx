import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DraftBanner, PostCard } from '@/components/journal/JournalParts';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { authors, findAuthor } from '@/content/authors';
import { visiblePosts } from '@/content/journal/posts';
import { shareMeta } from '@/lib/seo';
import { profilePageJsonLd } from '@/lib/structured-data';

export function generateStaticParams() {
  // Cache Components needs at least one; an unpublished profile answers "not found".
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: PageProps<'/journal/authors/[slug]'>): Promise<Metadata> {
  const author = findAuthor((await params).slug);
  if (!author) return {};
  return {
    title: `${author.name}, ${author.role}`,
    description: author.summary,
    alternates: { canonical: `/journal/authors/${author.slug}` },
    openGraph: shareMeta(`/journal/authors/${author.slug}`, { title: `${author.name} | Ayyara Rebirth` }),
    ...(author.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

/** The person behind the brand or its perfumes, with what they have written. */
export default async function AuthorPage({ params }: PageProps<'/journal/authors/[slug]'>) {
  const author = findAuthor((await params).slug);
  if (!author) notFound();
  const written = visiblePosts().filter((post) => post.author === author.slug);
  return (
    <Container size="narrow" className="pt-5 pb-16 sm:pt-8 md:pb-24">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Journal', href: '/journal' },
          { name: author.name, href: `/journal/authors/${author.slug}` },
        ]}
      />
      <header className="mt-6 md:mt-8">
        <p className="eyebrow">{author.role}</p>
        <h1 className="mt-2 text-4xl text-fg md:text-5xl">{author.name}</h1>
      </header>
      {author.draft && (
        <div className="mt-6">
          <DraftBanner what="profile" />
        </div>
      )}
      <div className="prose-luxe mt-8">
        {author.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        {author.profiles.length > 0 && (
          <p>
            Elsewhere:{' '}
            {author.profiles.map((url, index) => (
              <span key={url}>
                {index > 0 && ' · '}
                <a href={url} target="_blank" rel="noopener noreferrer me">
                  {new URL(url).hostname.replace(/^www\./, '')}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
      {written.length > 0 && (
        <section aria-labelledby="written-heading" className="mt-14 border-t border-line pt-10">
          <h2 id="written-heading" className="font-display text-3xl text-fg">
            Articles by {author.name}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
            {written.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      )}
      <JsonLd data={profilePageJsonLd(author)} />
    </Container>
  );
}
