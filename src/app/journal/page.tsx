import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/journal/JournalParts';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { visibleCategories, visiblePosts } from '@/content/journal/posts';
import { showDrafts } from '@/lib/drafts';
import { shareMeta } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Journal: Fragrance Guides',
  description: 'Plain answers to common perfume questions from Ayyara Rebirth: concentrations, making scent last, choosing a signature, seasons and gifting.',
  alternates: { canonical: '/journal' },
  openGraph: shareMeta('/journal', { title: 'Journal | Ayyara Rebirth' }),
  // While every article is a draft (shown only for review), the page stays out of search.
  ...(showDrafts && visiblePosts().every((post) => post.draft) ? { robots: { index: false, follow: false } } : {}),
};

/** The journal's front page: every published article, newest first. There is no page until one is published. */
export default function JournalPage() {
  const posts = visiblePosts();
  if (posts.length === 0) notFound();
  return (
    <Container className="pt-5 pb-16 sm:pt-8 md:pb-24">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Journal', href: '/journal' }]} />
      <header className="mt-6 max-w-2xl md:mt-8">
        <p className="eyebrow">The journal</p>
        <h1 className="mt-2 text-4xl text-fg md:text-6xl">Fragrance guides</h1>
        <p className="mt-3 text-base leading-relaxed text-fg-soft">Plain answers to the questions we are asked most about wearing, choosing and caring for perfume.</p>
      </header>
      <nav aria-label="Journal categories" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-3 md:mt-8">
        {visibleCategories().map((category) => (
          <Link key={category.slug} href={`/journal/category/${category.slug}`} className="text-xs font-medium tracking-[0.12em] text-mute uppercase hover:text-fg">
            {category.title}
          </Link>
        ))}
      </nav>
      <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
