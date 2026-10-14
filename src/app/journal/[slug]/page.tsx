import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Byline, DraftBanner, PostCard } from '@/components/journal/JournalParts';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { findAuthor } from '@/content/authors';
import { categoryOf, findPost, visiblePosts } from '@/content/journal/posts';
import { shareMeta, twitterMeta } from '@/lib/seo';
import { articleJsonLd } from '@/lib/structured-data';

/** Stand-in for the build when no article is published yet (Cache Components needs one); it answers "not found". */
const NO_POSTS = '__no-posts-yet__';

export function generateStaticParams() {
  const posts = visiblePosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: NO_POSTS }];
}

export async function generateMetadata({ params }: PageProps<'/journal/[slug]'>): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};
  const url = `/journal/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { ...shareMeta(url, { title: post.title, image: false }), type: 'article', description: post.description, publishedTime: post.published, modifiedTime: post.updated, images: [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.imageAlt }] },
    twitter: twitterMeta({ title: post.title, description: post.description, image: post.image.src }),
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

/** A journal article: a short answer first, then the detail under question-style headings. */
export default async function JournalPostPage({ params }: PageProps<'/journal/[slug]'>) {
  const post = findPost((await params).slug);
  if (!post) notFound();
  const { default: Body } = await import(`@/content/journal/${post.slug}.mdx`);
  const category = categoryOf(post.category);
  const author = findAuthor(post.author);
  const more = visiblePosts()
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  return (
    <>
      <Container size="narrow" className="pt-5 pb-16 sm:pt-8 md:pb-24">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Journal', href: '/journal' },
            ...(category ? [{ name: category.title, href: `/journal/category/${category.slug}` }] : []),
            { name: post.title, href: `/journal/${post.slug}` },
          ]}
        />
        <article className="mt-6 md:mt-8">
          <header>
            {category && (
              <Link href={`/journal/category/${category.slug}`} className="eyebrow hover:text-fg">
                {category.title}
              </Link>
            )}
            <h1 className="mt-2 text-4xl text-fg md:text-5xl">{post.title}</h1>
            <div className="mt-4">
              <Byline post={post} />
            </div>
          </header>
          {post.draft && (
            <div className="mt-6">
              <DraftBanner what="article" />
            </div>
          )}
          <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-surface">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" placeholder="blur" className="object-cover" />
          </div>
          {/* The answer first, for readers and for search and AI summaries. */}
          <section aria-label="In short" className="mt-8 border-l-2 border-gold bg-surface p-5">
            <p className="eyebrow">In short</p>
            <p className="mt-2 text-base leading-relaxed text-fg">{post.summary}</p>
          </section>
          <div className="prose-luxe mt-10">
            <Body />
          </div>
          {author && (
            <aside aria-label="About the author" className="mt-14 border-t border-line pt-8">
              <p className="eyebrow">About the author</p>
              <p className="mt-2 text-lg font-medium text-fg">
                <Link href={`/journal/authors/${author.slug}`} className="underline-offset-4 hover:underline">
                  {author.name}
                </Link>
              </p>
              <p className="text-sm text-mute">{author.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg-soft">{author.summary}</p>
            </aside>
          )}
        </article>
      </Container>

      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="bg-surface">
          <Container className="py-12 md:py-20">
            <h2 id="more-heading" className="font-display text-3xl text-fg md:text-4xl">
              More from the journal
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((other) => (
                <li key={other.slug}>
                  <PostCard post={other} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd data={articleJsonLd(post, author)} />
    </>
  );
}
