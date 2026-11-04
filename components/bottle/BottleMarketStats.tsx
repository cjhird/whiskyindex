import type { BottleMarketStats as Stats } from '@/lib/mock/auctions';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function BottleMarketStats({ stats }: { stats: Stats }) {
  const cards: Array<{
    label: string;
    value: string;
    note: string;
    tip: string;
    change?: number | null;
    muted?: boolean;
  }> = [
    {
      label: 'Latest auction price',
      value: stats.latest ? formatGBP(stats.latest.totalGbp) : '—',
      note: stats.latest
        ? `${formatDate(stats.latest.date)} · ${stats.latest.house}`
        : 'No recorded sales',
      tip: 'Most recent buyer-inclusive total (hammer + premium), converted to GBP where needed.',
    },
    {
      label: '12-month median',
      value: stats.median12m != null ? formatGBP(stats.median12m) : '—',
      note:
        stats.median12mCount > 0
          ? `${stats.median12mCount} transaction${stats.median12mCount === 1 ? '' : 's'}`
          : 'Insufficient sales',
      tip: 'Median buyer-inclusive GBP total across recorded sales in the preceding 12 months.',
    },
    {
      label: '12-month price change',
      value: stats.change12mAvailable && stats.change12mPct != null ? '' : 'Unavailable',
      note: stats.change12mAvailable
        ? 'Median vs prior 12 months'
        : 'Needs ≥3 sales in each window',
      tip: 'Percentage change between current and prior 12-month medians.',
      change: stats.change12mAvailable ? stats.change12mPct : null,
      muted: !stats.change12mAvailable,
    },
    {
      label: '12-month sales',
      value: String(stats.sales12m),
      note: `${stats.houses12m} auction house${stats.houses12m === 1 ? '' : 's'}`,
      tip: 'Recorded single-bottle auction sales for this release in the past 12 months.',
    },
  ];

  return (
    <section aria-label="Auction market statistics">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Market statistics</h2>
        <p className="mt-1 text-sm text-ink-muted">Recorded auction totals — not estimated values.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} title={c.tip} className="border-b border-line pb-4 lg:border-0 lg:pb-0">
            <p className="label-meta">{c.label}</p>
            {c.change != null ? (
              <p className="mt-2">
                <ChangeText value={c.change} className="text-2xl font-semibold tracking-tight" />
              </p>
            ) : (
              <p
                className={`mt-2 font-mono-num text-2xl font-semibold tracking-tight ${
                  c.muted ? 'text-ink-muted' : 'text-ink'
                }`}
              >
                {c.value}
              </p>
            )}
            <p className="mt-1 text-sm text-ink-muted">{c.note}</p>
          </div>
        ))}
      </div>

      {(stats.high12m != null || stats.low12m != null) && (
        <details className="mt-8 border-t border-line pt-4">
          <summary className="cursor-pointer text-sm font-medium text-ink-muted hover:text-ink">
            More stats
          </summary>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="label-meta">12-month high</dt>
              <dd className="mt-1 font-mono-num text-sm font-medium text-ink">
                {stats.high12m != null ? formatGBP(stats.high12m) : '—'}
              </dd>
            </div>
            <div>
              <dt className="label-meta">12-month low</dt>
              <dd className="mt-1 font-mono-num text-sm font-medium text-ink">
                {stats.low12m != null ? formatGBP(stats.low12m) : '—'}
              </dd>
            </div>
            <div>
              <dt className="label-meta">Total recorded sales</dt>
              <dd className="mt-1 font-mono-num text-sm font-medium text-ink">
                {stats.totalHistorical}
              </dd>
            </div>
          </dl>
        </details>
      )}
    </section>
  );
}
