import { SearchHero } from '@/components/SearchHero';
import { HomeMarket } from '@/components/HomeMarket';
import Link from 'next/link';
import { articles } from '@/lib/mock/articles';

export default function HomePage() {
  const latest = articles.slice(0, 3);

  return (
    <>
      <SearchHero />
      <HomeMarket />
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Research desk</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Notes on methodology, segments, and auction structure.
              </p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-ink-muted hover:text-ink">
              All articles →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {latest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="surface group rounded-lg border-l-4 border-l-ink p-5 transition hover:border-line-strong"
              >
                <p className="label-caps">
                  {a.category} · {a.readMinutes} min ·{' '}
                  {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
