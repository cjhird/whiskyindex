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
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Research</h2>
            <Link href="/blog" className="text-sm text-ink-muted hover:text-ink">
              All notes →
            </Link>
          </div>
          <div className="grid gap-1 md:grid-cols-3 md:gap-2">
            {latest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group rounded-xl px-4 py-4 transition hover:bg-surface-muted"
              >
                <p className="label-meta">
                  {a.category} · {a.readMinutes} min ·{' '}
                  {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
                <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-ink group-hover:underline">
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
