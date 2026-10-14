import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/journal/JournalParts';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { categories, categoryOf, visibleCategories, visiblePosts } from '@/content/journal/posts';
import { shareMeta } from '@/lib/seo';

export function generateStaticParams() {
  // Cache Components needs at least one; a category with no published articles answers "not found".
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<'/journal/category/[category]'>): Promise<Metadata> {
  const category = categoryOf((await params).category);
  if (!category) return {};
  const posts = visiblePosts().filter((post) => post.category === category.slug);
  return {
    title: `${category.title} | Journal`,
    description: category.description,
    alternates: { canonical: `/journal/category/${category.slug}` },
    openGraph: shareMeta(`/journal/category/${category.slug}`, { title: `${category.title} | Ayyara Rebirth` }),
    ...(posts.every((post) => post.draft) ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function JournalCategoryPage({ params }: PageProps<'/journal/category/[category]'>) {
  const { category: slug } = await params;
  const category = visibleCategories().find((c) => c.slug === slug);
  if (!category) notFound();
  const posts = visiblePosts().filter((post) => post.category === category.slug);
  return (
    <Container className="pt-5 pb-16 sm:pt-8 md:pb-24">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Journal', href: '/journal' },
          { name: category.title, href: `/journal/category/${category.slug}` },
        ]}
      />
      <header className="mt-6 max-w-2xl md:mt-8">
        <p className="eyebrow">Journal</p>
        <h1 className="mt-2 text-4xl text-fg md:text-6xl">{category.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-fg-soft">{category.description}</p>
      </header>
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
