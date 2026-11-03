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
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Market board</h2>
            <p className="mt-1 text-sm text-ink-muted">Segment indexes from closed UK auction months.</p>
          </div>
          <Link href="/screener" className="text-sm font-medium text-ink-muted hover:text-ink">
            Open screener →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {marketIndices.map((idx, i) => (
            <div
              key={idx.name}
              className="surface rounded-lg p-4 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="label-caps">{idx.name}</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="font-mono-num text-2xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                <ChangeBadge value={idx.change1d} />
              </div>
              <p className="mt-2 text-xs font-medium text-ink-muted">
                1M <ChangeText value={idx.change1m} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <MoverPanel title="Top gainers · 1M" rows={gainers} />
        <MoverPanel title="Top decliners · 1M" rows={losers} />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Watch collections</h2>
          <p className="mt-1 text-sm text-ink-muted">Curated sleeves with liquid auction history.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="surface group rounded-lg p-4 transition hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                  {c.name}
                </h3>
                <ChangeBadge value={c.change1m} size="sm" />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
              <p className="mt-4 font-mono-num text-xs font-medium text-ink-muted">{c.count} bottles</p>
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
    <div className="surface overflow-hidden rounded-lg">
      <div className="border-b border-line bg-surface-muted px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <ul>
        {rows.map((b, i) => (
          <li key={b.id} className={i % 2 === 1 ? 'bg-surface-zebra' : 'bg-white'}>
            <Link
              href={`/bottle/${b.slug}`}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#eef1f4]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{b.name}</p>
                <p className="truncate text-xs font-medium text-ink-muted">
                  {b.brand} · {b.region}
                </p>
              </div>
              <Sparkline values={b.sparkline} />
              <div className="w-24 text-right">
                <p className="font-mono-num text-sm font-semibold text-ink">{formatGBP(b.latestPrice)}</p>
                <ChangeText value={b.change1m} className="text-xs" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
