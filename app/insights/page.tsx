import Link from 'next/link';
import type { Metadata } from 'next';
import { articles } from '@/lib/mock/articles';
import type { ArticleCategory } from '@/lib/mock/types';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Whisky secondary-market notes, methodology, and collector guides from WhiskyIndex.',
};

const categories: Array<ArticleCategory | 'All'> = [
  'All',
  'News',
  'Guide',
  'Analysis',
  'Market Report',
];

type Props = { searchParams?: { category?: string } };

export default function InsightsPage({ searchParams }: Props) {
  const category = searchParams?.category;
  const filtered =
    category && category !== 'All'
      ? articles.filter((a) => a.category === category)
      : [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const [featured, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Insights</h1>
      <p className="mt-2 text-sm text-ink-muted">Market intelligence and industry knowledge.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => {
          const href = c === 'All' ? '/insights' : `/insights?category=${encodeURIComponent(c)}`;
          const active = c === 'All' ? !category : category === c;
          return (
            <Link
              key={c}
              href={href}
              className={
                active
                  ? 'rounded-md bg-surface-muted px-3 py-1.5 text-sm font-medium text-ink'
                  : 'rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink'
              }
            >
              {c === 'Guide' ? 'Guides' : c === 'Market Report' ? 'Market Reports' : c}
            </Link>
          );
        })}
      </div>

      {featured ? (
        <>
          <Link href={`/insights/${featured.slug}`} className="group mt-8 block">
            <p className="label-meta">
              {featured.category} ·{' '}
              {new Date(featured.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {featured.readMinutes} min
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink group-hover:underline sm:text-[1.75rem]">
              {featured.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted sm:text-base">{featured.excerpt}</p>
          </Link>

          <ul className="mt-8 divide-y divide-line border-t border-line">
            {rest.map((a) => (
              <li key={a.slug}>
                <Link href={`/insights/${a.slug}`} className="group row-hover block py-6">
                  <p className="label-meta">
                    {a.category} ·{' '}
                    {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {a.readMinutes} min
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted line-clamp-2">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-10 text-sm text-ink-muted">No articles in this category yet.</p>
      )}
    </div>
  );
}
