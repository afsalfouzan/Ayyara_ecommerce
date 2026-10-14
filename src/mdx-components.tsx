import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { ProductPicks } from '@/components/journal/ProductPicks';

/*
 * How journal articles (MDX) render. Text styling comes from the article's
 * `prose-luxe` wrapper; these swap in site links and the components articles
 * may use.
 */
const components: MDXComponents = {
  a: ({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) =>
    href.startsWith('/') ? <Link href={href} {...props} /> : <a href={href} target="_blank" rel="noopener noreferrer" {...props} />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm [&_td]:border-b [&_td]:border-line [&_td]:px-3 [&_td]:py-2.5 [&_th]:border-b [&_th]:border-fg [&_th]:px-3 [&_th]:py-2.5 [&_th]:font-medium [&_th]:text-fg" {...props} />
    </div>
  ),
  ProductPicks,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
