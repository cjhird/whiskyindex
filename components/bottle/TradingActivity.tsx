import type { BottleMarketStats, MonthlyVolume } from '@/lib/mock/auctions';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function TradingActivity({
  stats,
  volume,
  latestDate,
}: {
  stats: BottleMarketStats;
  volume: MonthlyVolume[];
  latestDate: string | null;
}) {
  const max = Math.max(...volume.map((v) => v.count), 1);
  const width = 720;
  const height = 200;
  const pad = { t: 12, r: 12, b: 32, l: 40 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const gap = volume.length ? innerW / volume.length : innerW;
  const barW = Math.max(3, gap * 0.55);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Trading Activity</h2>
        <p className="mt-1 text-sm text-ink-muted">
          How often this exact release appears and clears at auction. Low volume does not imply
          rarity or value.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Sales (12 months)"
          value={String(stats.sales12m)}
          tip="Recorded single-bottle sales in the past 12 months."
        />
        <Stat
          label="Total historical"
          value={String(stats.totalHistorical)}
          tip="All matched single-bottle lots in the illustrative history."
        />
        <Stat
          label="Most recent sale"
          value={latestDate ? formatDate(latestDate) : '—'}
          tip={
            stats.daysSinceLastSale != null
              ? `${stats.daysSinceLastSale} days before data as-of.`
              : 'No sales recorded.'
          }
        />
        <Stat
          label="Auction houses"
          value={String(stats.houses12m)}
          tip="Distinct houses with a sale in the past 12 months."
        />
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-6">
        <div>
          <p className="label-meta">Liquidity</p>
          <p className="mt-1 text-sm font-medium text-ink">{stats.liquidityClass}</p>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">{stats.liquidityNote}</p>
        </div>
        {stats.typicalDaysBetweenSales != null && (
          <div>
            <p className="label-meta">Typical gap between sales</p>
            <p className="mt-1 font-mono-num text-sm font-medium text-ink">
              ~{stats.typicalDaysBetweenSales} days
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 border border-line">
        <div className="border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">Sales by month</p>
          <p className="mt-1 text-sm text-ink-muted">
            Count of recorded bottles sold — months with zero sales are omitted.
          </p>
        </div>
        <div className="px-2 py-3 sm:px-4">
          {volume.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-muted">No volume history available.</p>
          ) : (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-auto w-full"
              role="img"
              aria-label="Monthly trading volume"
            >
              {[0, 0.5, 1].map((t) => {
                const y = pad.t + (1 - t) * innerH;
                const v = Math.round(max * t);
                return (
                  <g key={t}>
                    <line
                      x1={pad.l}
                      x2={width - pad.r}
                      y1={y}
                      y2={y}
                      stroke="var(--line)"
                      strokeWidth="1"
                    />
                    <text
                      x={pad.l - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-[var(--ink-faint)]"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                    >
                      {v}
                    </text>
                  </g>
                );
              })}
              {volume.map((row, i) => {
                const h = (row.count / max) * innerH;
                const x = pad.l + i * gap + (gap - barW) / 2;
                const y = pad.t + innerH - h;
                return (
                  <g key={row.month}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={Math.max(h, 1)}
                      fill="var(--ink)"
                      opacity={0.78}
                      rx="1"
                    >
                      <title>
                        {row.month}: {row.count}
                      </title>
                    </rect>
                    {(i === 0 ||
                      i === volume.length - 1 ||
                      i % Math.ceil(volume.length / 6) === 0) && (
                      <text
                        x={x + barW / 2}
                        y={height - 10}
                        textAnchor="middle"
                        className="fill-[var(--ink-faint)]"
                        fontSize="9"
                      >
                        {row.month.slice(2)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, tip }: { label: string; value: string; tip: string }) {
  return (
    <div title={tip} className="border-b border-line pb-4 lg:border-0 lg:pb-0">
      <p className="label-meta">{label}</p>
      <p className="mt-2 font-mono-num text-xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  );
}
