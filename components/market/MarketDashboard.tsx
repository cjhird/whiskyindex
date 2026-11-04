'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  PERIODS,
  type PeriodId,
  type SegmentKind,
  activityChange,
  highestValueRecentSales,
  latestTransactions,
  marketInsightArticles,
  marketSegments,
  marketSnapshot,
  mostTradedBottles,
  sliceActivity,
  topAuctionHouses,
} from '@/lib/mock/market';
import { ActivityBarChart } from '@/components/market/ActivityBarChart';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { cn, formatGBP, formatPct } from '@/lib/format';

type Agg = 'monthly' | 'quarterly' | 'annual';

function aggregateRows(
  rows: ReturnType<typeof sliceActivity>,
  agg: Agg
): ReturnType<typeof sliceActivity> {
  if (agg === 'monthly') return rows;
  const bucket = new Map<string, { month: string; turnover: number; volume: number; houses: number }>();
  for (const r of rows) {
    const [y, m] = r.month.split('-').map(Number);
    const key =
      agg === 'annual'
        ? `${y}`
        : `${y}-Q${Math.ceil(m / 3)}`;
    const prev = bucket.get(key);
    if (prev) {
      prev.turnover += r.turnover;
      prev.volume += r.volume;
      prev.houses = Math.max(prev.houses, r.houses);
    } else {
      bucket.set(key, { month: key, turnover: r.turnover, volume: r.volume, houses: r.houses });
    }
  }
  return Array.from(bucket.values());
}

export function MarketDashboard() {
  const [period, setPeriod] = useState<PeriodId>('1Y');
  const [currency] = useState<'GBP'>('GBP');
  const [metric, setMetric] = useState<'turnover' | 'volume'>('turnover');
  const [agg, setAgg] = useState<Agg>('monthly');
  const [segment, setSegment] = useState<SegmentKind>('region');
  const [segSort, setSegSort] = useState<'turnover' | 'bottlesSold' | 'avgLot'>('turnover');

  const activity = useMemo(() => aggregateRows(sliceActivity(period), agg), [period, agg]);
  const change = useMemo(() => activityChange(period), [period]);
  const segments = useMemo(() => {
    const rows = marketSegments(segment);
    return [...rows].sort((a, b) => b[segSort] - a[segSort]);
  }, [segment, segSort]);
  const traded = mostTradedBottles(8);
  const houses = topAuctionHouses(5);
  const highSales = highestValueRecentSales(5);
  const latest = latestTransactions(6);
  const insights = marketInsightArticles(3);

  const headline = [
    {
      label: 'Unique bottles traded',
      value: marketSnapshot.uniqueBottles.toLocaleString('en-GB'),
      change: marketSnapshot.uniqueBottlesChangePct,
      note: marketSnapshot.periodLabel,
      tip: 'Distinct bottle listings with at least one recorded sale in the period. Substitutes for a proprietary market index until methodology ships.',
    },
    {
      label: 'Auction turnover',
      value: formatGBP(marketSnapshot.turnoverGbp, { compact: true }),
      change: marketSnapshot.turnoverChangePct,
      note: marketSnapshot.periodLabel,
      tip: 'Sum of recorded buyer-inclusive auction totals across covered houses.',
    },
    {
      label: 'Bottles sold',
      value: marketSnapshot.bottlesSold.toLocaleString('en-GB'),
      change: marketSnapshot.bottlesSoldChangePct,
      note: marketSnapshot.periodLabel,
      tip: 'Count of individual bottles sold at auction in the reporting month.',
    },
    {
      label: 'Active distilleries',
      value: String(marketSnapshot.activeDistilleries),
      change: marketSnapshot.activeDistilleriesChangePct,
      note: marketSnapshot.periodLabel,
      tip: 'Distinct distilleries represented in recorded sales for the period.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:py-10">
      {/* Header + controls */}
      <header className="border-b border-line pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
              Whisky Market Overview
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
              Explore price performance, trading activity and trends across the global secondary
              whisky market.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Reporting month <span className="text-ink">{marketSnapshot.periodLabel}</span>
              <span className="text-ink-faint"> · </span>
              {marketSnapshot.updatedLabel}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1" role="group" aria-label="Time period">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-sm font-medium transition',
                    period === p.id
                      ? 'bg-surface-muted text-ink'
                      : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="sr-only">Currency</span>
              <select
                className="field w-auto py-1.5"
                value={currency}
                disabled
                title="Additional currencies when FX normalisation ships"
              >
                <option value="GBP">GBP</option>
              </select>
            </label>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-faint">{marketSnapshot.disclaimer}</p>
      </header>

      {/* Headline metrics */}
      <section aria-label="Headline market statistics">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {headline.map((m) => (
            <div key={m.label} title={m.tip} className="border-b border-line pb-4 lg:border-0 lg:pb-0">
              <p className="label-meta">{m.label}</p>
              <p className="mt-2 font-mono-num text-2xl font-semibold tracking-tight text-ink">
                {m.value}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                <ChangeText value={m.change} /> vs prior period · {m.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Market performance = trading activity centrepiece (no fabricated index) */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Market Performance</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Historical auction turnover — primary dashboard chart until a defensible price index
              ships.
            </p>
          </div>
          <Link href="/market/indices" className="text-sm text-ink-muted hover:text-ink">
            Planned indices →
          </Link>
        </div>
        <div className="border border-line">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink">
                Auction turnover · {period}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Period change <ChangeText value={change.turnoverPct} /> · activity, not bottle price
              </p>
            </div>
            <p className="text-sm text-ink-faint">Hover bars for month values</p>
          </div>
          <ActivityBarChart rows={activity} metric="turnover" />
          <p className="border-t border-line px-4 py-2 text-sm text-ink-faint">
            Proprietary benchmarks (WhiskyIndex 100, Scotch, Japan, Speyside, Islay, Macallan) will
            appear here once methodology is implemented — see{' '}
            <Link href="/methodology" className="underline-offset-2 hover:underline">
              methodology
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Trading activity controls */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">
              Market Trading Activity
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              How actively whisky is trading — separate from price appreciation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['turnover', 'Turnover'],
                ['volume', 'Volume'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMetric(id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium',
                  metric === id ? 'bg-surface-muted text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
            {(
              [
                ['monthly', 'Monthly'],
                ['quarterly', 'Quarterly'],
                ['annual', 'Annual'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAgg(id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium',
                  agg === id ? 'bg-surface-muted text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-line">
          <div className="grid gap-4 border-b border-line px-4 py-3 sm:grid-cols-3">
            <MiniStat
              label={metric === 'turnover' ? 'Selected turnover change' : 'Selected volume change'}
              value={<ChangeText value={metric === 'turnover' ? change.turnoverPct : change.volumePct} />}
            />
            <MiniStat label="Unique bottles (month)" value={marketSnapshot.uniqueBottles.toLocaleString('en-GB')} />
            <MiniStat label="Participating houses (month)" value={String(marketSnapshot.housesCovered)} />
          </div>
          <ActivityBarChart rows={activity} metric={metric} />
        </div>
      </section>

      {/* Segments */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">
              Explore Market Performance
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Segment comparison from recorded auction activity (not segment price indices).
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {(
              [
                ['region', 'Region'],
                ['distillery', 'Distillery'],
                ['country', 'Country'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSegment(id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium',
                  segment === id ? 'bg-surface-muted text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{segment === 'region' ? 'Region' : segment === 'country' ? 'Country' : 'Distillery'}</th>
                  <th className="text-right">
                    <SortBtn active={segSort === 'turnover'} onClick={() => setSegSort('turnover')}>
                      Turnover
                    </SortBtn>
                  </th>
                  <th className="text-right">
                    <SortBtn active={segSort === 'bottlesSold'} onClick={() => setSegSort('bottlesSold')}>
                      Bottles sold
                    </SortBtn>
                  </th>
                  <th className="text-right">
                    <SortBtn active={segSort === 'avgLot'} onClick={() => setSegSort('avgLot')}>
                      Avg lot
                    </SortBtn>
                  </th>
                  <th className="text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((r) => (
                  <tr key={r.name}>
                    <td>
                      {r.slug ? (
                        <Link href={`/distilleries/${r.slug}`} className="font-medium text-ink hover:underline">
                          {r.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-ink">{r.name}</span>
                      )}
                    </td>
                    <td className="text-right font-mono-num">{formatGBP(r.turnover, { compact: true })}</td>
                    <td className="text-right font-mono-num text-ink-muted">
                      {r.bottlesSold.toLocaleString('en-GB')}
                    </td>
                    <td className="text-right font-mono-num">{formatGBP(r.avgLot)}</td>
                    <td className="text-right font-mono-num text-ink-muted">{formatPct(r.sharePct, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-faint">
            Derived from the mock bottle universe for layout — production will use full auction
            history. Price-performance columns reserved for when segment indices exist.
          </p>
        </div>
      </section>

      {/* Most traded (initial movers substitute) */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Market Movers</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Most traded bottles for the initial release. Percentage price movers require minimum
              sample sizes and will ship with the index methodology.
            </p>
          </div>
          <Link href="/screener" className="text-sm font-medium text-ink hover:underline">
            Explore More in Screener →
          </Link>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bottle</th>
                <th>Distillery</th>
                <th className="text-right">Latest price</th>
                <th className="text-right">30D volume</th>
                <th className="text-right">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {traded.map((r) => (
                <tr key={r.bottle.id}>
                  <td>
                    <Link href={`/bottles/${r.bottle.slug}`} className="font-medium text-ink hover:underline">
                      {r.bottle.name}
                    </Link>
                  </td>
                  <td className="text-ink-muted">{r.bottle.distillery}</td>
                  <td className="text-right font-mono-num font-medium">
                    {formatGBP(r.bottle.latestPrice)}
                  </td>
                  <td className="text-right font-mono-num text-ink-muted">{r.recentVolume}</td>
                  <td className="text-right font-mono-num text-ink-muted">{r.transactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Auction activity */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Auction Activity</h2>
          <Link href="/auctions" className="text-sm font-medium text-ink hover:underline">
            View All Auction Results →
          </Link>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">Top houses by recorded sales</h3>
            <ul className="mt-3 divide-y divide-line">
              {houses.map((h) => (
                <li key={h.house} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{h.house}</p>
                    <p className="text-sm text-ink-muted">{h.lots} lots in sample</p>
                  </div>
                  <p className="font-mono-num text-sm text-ink">{formatGBP(h.turnover, { compact: true })}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Highest-value recent sales</h3>
            <ul className="mt-3 divide-y divide-line">
              {highSales.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/bottles/${r.bottleSlug}`}
                    className="row-hover flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{r.bottleName}</p>
                      <p className="truncate text-sm text-ink-muted">
                        {r.house} · {r.date}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono-num text-sm font-medium text-ink">
                      {formatGBP(r.totalGbp)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-ink">Latest recorded transactions</h3>
          <div className="mt-3 data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bottle</th>
                  <th>House</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono-num text-ink-muted">{r.date}</td>
                    <td>
                      <Link href={`/bottles/${r.bottleSlug}`} className="font-medium hover:underline">
                        {r.bottleName}
                      </Link>
                    </td>
                    <td className="text-ink-muted">{r.house}</td>
                    <td className="text-right font-mono-num font-medium">{formatGBP(r.totalGbp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Market Insights</h2>
          <Link href="/insights" className="text-sm font-medium text-ink hover:underline">
            View All Insights →
          </Link>
        </div>
        <ul className="divide-y divide-line border-t border-line">
          {insights.map((a) => (
            <li key={a.slug}>
              <Link href={`/insights/${a.slug}`} className="group row-hover flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                <p className="label-meta shrink-0 sm:w-40">
                  {a.category} ·{' '}
                  {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
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
      </section>

      {/* Methodology */}
      <section className="border-t border-line pt-10">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Data coverage & methodology</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetaItem label="Auction houses (sample)" value={marketSnapshot.houses.join(', ')} />
          <MetaItem label="Period covered" value={`${marketSnapshot.periodLabel} close · charts use illustrative monthly series`} />
          <MetaItem label="Update cadence" value={marketSnapshot.updateCadence} />
          <MetaItem label="Price basis" value={marketSnapshot.priceBasis} />
          <MetaItem label="Currency" value={marketSnapshot.currencyNote} />
          <MetaItem
            label="Performance & indices"
            value="Bottle and segment price indices are not yet calculated. Trading activity metrics are shown instead."
          />
        </dl>
        <p className="mt-4 text-sm text-ink-muted">
          Statistics reflect recorded transactions from covered auction houses in this demo — not the
          entire worldwide whisky market.{' '}
          <Link href="/methodology" className="font-medium text-ink hover:underline">
            Read methodology →
          </Link>
        </p>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="label-meta">{label}</p>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-meta">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-ink-muted">{value}</dd>
    </div>
  );
}

function SortBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={cn(active ? 'text-ink' : 'text-ink-faint hover:text-ink')}>
      {children}
      {active ? ' ↓' : ''}
    </button>
  );
}
