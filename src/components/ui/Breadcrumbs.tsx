import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { absoluteUrl } from '@/lib/site';

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-mute">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="link-underline hover:text-fg">
                      {item.name}
                    </Link>
                    <span aria-hidden className="text-line">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}
