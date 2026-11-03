import Link from 'next/link';
import type { Metadata } from 'next';
import { articles } from '@/lib/mock/articles';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Whisky secondary-market notes, methodology, and collector guides from WhiskyIndex.',
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Research</h1>
        <p className="mt-3 text-ink-muted">
          Auction structure, index methodology, and segment notes for serious whisky collectors.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="surface group rounded-lg p-6 transition hover:border-line-strong"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              {a.category} · {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {a.readMinutes} min
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink group-hover:underline">
              {a.title}
            </h2>
            <p className="mt-3 text-sm text-ink-muted">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
