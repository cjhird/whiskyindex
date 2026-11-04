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
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Market notes</h1>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-8 block rounded-2xl bg-surface-muted p-6 transition hover:bg-[#efeff1] sm:p-8"
        >
          <p className="label-meta">
            {featured.category} ·{' '}
            {new Date(featured.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            · {featured.readMinutes} min
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink group-hover:underline sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base">
            {featured.excerpt}
          </p>
        </Link>
      )}

      <div className="mt-4 grid gap-1 md:grid-cols-2 lg:grid-cols-3 md:gap-2">
        {rest.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="group rounded-xl px-4 py-4 transition hover:bg-surface-muted"
          >
            <p className="label-meta">
              {a.category} ·{' '}
              {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {a.readMinutes} min
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-ink group-hover:underline">
              {a.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
