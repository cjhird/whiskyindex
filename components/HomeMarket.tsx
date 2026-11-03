import Link from 'next/link';
import { collections, marketIndices, topMovers } from '@/lib/mock/bottles';
import { ChangeBadge, ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { formatGBP } from '@/lib/format';

export function HomeMarket() {
  const { gainers, losers } = topMovers(5);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:py-10">
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Market board</h2>
          <Link href="/screener" className="text-sm text-ink-muted hover:text-ink">
            Screener →
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {marketIndices.map((idx, i) => (
            <div
              key={idx.name}
              className="surface-panel rounded-xl p-4 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="label-meta">{idx.name}</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="font-mono-num text-2xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                <ChangeBadge value={idx.change1d} />
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                1M <ChangeText value={idx.change1m} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MoverPanel title="Top gainers · 1M" rows={gainers} />
        <MoverPanel title="Top decliners · 1M" rows={losers} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-[-0.03em] text-ink">Watch collections</h2>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="surface-panel group rounded-xl p-4 transition hover:bg-[#efeff1]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium tracking-[-0.02em] text-ink group-hover:underline">
                  {c.name}
                </h3>
                <ChangeBadge value={c.change1m} size="sm" />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
              <p className="mt-4 font-mono-num text-xs text-ink-muted">{c.count} bottles</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function MoverPanel({
  title,
  rows,
}: {
  title: string;
  rows: ReturnType<typeof topMovers>['gainers'];
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-muted">
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <ul>
        {rows.map((b) => (
          <li key={b.id}>
            <Link
              href={`/bottle/${b.slug}`}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#eaeaec]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                <p className="truncate text-xs text-ink-muted">
                  {b.brand} · {b.region}
                </p>
              </div>
              <Sparkline values={b.sparkline} />
              <div className="w-24 text-right">
                <p className="font-mono-num text-sm font-medium text-ink">{formatGBP(b.latestPrice)}</p>
                <ChangeText value={b.change1m} className="text-xs" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
