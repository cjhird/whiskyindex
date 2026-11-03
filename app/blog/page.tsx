import Link from 'next/link';
import type { Metadata } from 'next';
import { articles } from '@/lib/mock/articles';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Whisky secondary-market notes, methodology, and collector guides from WhiskyIndex.',
};

export default function BlogPage() {
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="max-w-2xl">
        <p className="label-caps">Research desk</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink">Market notes</h1>
        <p className="mt-3 text-ink-muted">
          Auction structure, index methodology, and segment notes for serious whisky collectors.
        </p>
      </div>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="surface group mt-8 block rounded-xl p-6 transition hover:border-line-strong sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {featured.category}
            </span>
            <span className="text-xs font-medium text-ink-muted">
              {new Date(featured.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {featured.readMinutes} min
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink group-hover:underline sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base">{featured.excerpt}</p>
        </Link>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="surface group rounded-lg border-l-4 border-l-ink p-5 transition hover:border-line-strong"
          >
            <p className="label-caps">
              {a.category} ·{' '}
              {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {a.readMinutes} min
            </p>
            <h2 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-ink group-hover:underline">
              {a.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
