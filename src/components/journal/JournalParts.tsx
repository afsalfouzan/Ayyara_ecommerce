import Image from 'next/image';
import Link from 'next/link';
import { findAuthor } from '@/content/authors';
import { categoryOf, type Post } from '@/content/journal/posts';
import { formatDate } from '@/lib/format';

/** Shown on anything awaiting the client's approval; never on the live site, where drafts aren't shown at all. */
export function DraftBanner({ what }: { what: string }) {
  return (
    <p className="border border-gold/60 bg-gold-soft/50 p-4 text-sm text-fg-soft">
      <strong className="label block text-gold">Draft for client review</strong>
      This {what} is not published. It is visible only while developing or on a staging preview, and is kept out of search, the sitemap and llms.txt.
    </p>
  );
}

/** Who wrote it and when. Links to the author's profile when it is published; otherwise credits the brand. */
export function Byline({ post }: { post: Post }) {
  const author = findAuthor(post.author);
  return (
    <p className="text-sm text-mute">
      By {author ? <Link href={`/journal/authors/${author.slug}`} className="text-fg underline-offset-4 hover:underline">{author.name}</Link> : 'Ayyara Rebirth'}
      {' · '}
      <time dateTime={post.published}>{formatDate(post.published)}</time>
      {post.updated !== post.published && (
        <>
          {' · Updated '}
          <time dateTime={post.updated}>{formatDate(post.updated)}</time>
        </>
      )}
    </p>
  );
}

export function PostCard({ post, headingLevel: Heading = 'h2' }: { post: Post; headingLevel?: 'h2' | 'h3' }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/journal/${post.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-[4/3] overflow-hidden bg-surface">
        <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" placeholder="blur" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]" />
      </Link>
      <p className="eyebrow mt-4">
        {categoryOf(post.category)?.title}
        {post.draft && <span className="ml-2 text-gold">· Draft</span>}
      </p>
      <Heading className="mt-2 font-display text-2xl leading-snug text-fg">
        <Link href={`/journal/${post.slug}`} className="underline-offset-4 hover:underline">
          {post.title}
        </Link>
      </Heading>
      <p className="mt-2 text-sm leading-relaxed text-fg-soft">{post.description}</p>
    </article>
  );
}
