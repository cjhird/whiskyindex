import Link from 'next/link';
import { SearchHero } from '@/components/SearchHero';
import { articles } from '@/lib/mock/articles';
import { marketIndices, topMovers } from '@/lib/mock/bottles';
import { ChangeBadge, ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';

export default function HomePage() {
  const latest = articles.slice(0, 3);
  const { gainers } = topMovers(3);

  return (
    <>
      <SearchHero />

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl space-y-12 px-4 py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Market snapshot</h2>
              <p className="mt-2 max-w-lg text-sm text-ink-muted">
                Segment indexes and recent movers. Full board on Market.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/market" className="text-ink-muted hover:text-ink">
                Market overview →
              </Link>
              <Link href="/pricing" className="font-medium text-ink hover:underline">
                View pricing
              </Link>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {marketIndices.map((idx) => (
              <Link key={idx.slug} href="/market/indices" className="group block">
                <p className="label-meta group-hover:text-ink">{idx.name}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="font-mono-num text-2xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                  <ChangeBadge value={idx.change1d} size="sm" />
                </div>
              </Link>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h3 className="text-sm font-semibold text-ink">Top gainers · 1M</h3>
              <Link href="/market" className="text-sm text-ink-muted hover:text-ink">
                All movers →
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {gainers.map((b) => (
                <li key={b.id}>
                  <Link href={`/bottles/${b.slug}`} className="row-hover flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                      <p className="truncate text-sm text-ink-muted">
                        {b.brand} · {b.region}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono-num text-sm text-ink">{formatGBP(b.latestPrice)}</p>
                      <ChangeText value={b.change1m} className="text-sm" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Insights</h2>
            <Link href="/insights" className="text-sm text-ink-muted hover:text-ink">
              All notes →
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {latest.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="group row-hover flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <p className="label-meta shrink-0 sm:w-40">
                    {a.category} · {a.readMinutes} min
                  </p>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted line-clamp-2">{a.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Track marks with a portfolio</h2>
            <p className="mt-2 max-w-lg text-sm text-ink-muted">
              Member plans unlock holdings, watchlists, and deeper auction history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pricing" className="btn btn-primary px-5 py-2.5">
              View pricing
            </Link>
            <Link href="/signup" className="btn btn-ghost px-5 py-2.5">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
