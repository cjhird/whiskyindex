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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Research desk</h2>
              <p className="mt-1 text-sm text-ink-muted">Notes on methodology, segments, and auction structure.</p>
            </div>
            <Link href="/blog" className="text-sm text-ink-muted hover:text-ink">
              All articles →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {latest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="surface group rounded-lg p-5 transition hover:border-line-strong"
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  {a.category} · {a.readMinutes} min
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
