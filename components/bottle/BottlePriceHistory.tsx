'use client';

import { useMemo, useState } from 'react';
import type { AuctionComp, MonthlyMedian } from '@/lib/mock/auctions';
import { formatGBP } from '@/lib/format';
import { cn } from '@/lib/format';

const RANGES = [
  { id: '3m', label: '3M', months: 3 },
  { id: '6m', label: '6M', months: 6 },
  { id: '1y', label: '1Y', months: 12 },
  { id: '3y', label: '3Y', months: 36 },
  { id: '5y', label: '5Y', months: 60 },
  { id: 'all', label: 'ALL', months: 999 },
] as const;

type Mode = 'trend' | 'sales';

function monthsAgo(isoAsOf: string, months: number) {
  const d = new Date(`${isoAsOf}T12:00:00Z`);
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

export function BottlePriceHistory({
  sales,
  monthlyMedians,
  asOf,
  currency = 'GBP',
}: {
  sales: AuctionComp[];
  monthlyMedians: MonthlyMedian[];
  asOf: string;
  currency?: string;
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]['id']>('1y');
  const [mode, setMode] = useState<Mode>('trend');
  const [hover, setHover] = useState<number | null>(null);

  const cutoff = useMemo(() => {
    const months = RANGES.find((r) => r.id === range)?.months ?? 12;
    if (months >= 999) return '1970-01-01';
    return monthsAgo(asOf, months);
  }, [range, asOf]);

  const filteredSales = useMemo(
    () => sales.filter((s) => s.date >= cutoff).sort((a, b) => a.date.localeCompare(b.date)),
    [sales, cutoff]
  );

  const filteredMedians = useMemo(
    () => monthlyMedians.filter((m) => `${m.month}-01` >= cutoff.slice(0, 7) || m.month >= cutoff.slice(0, 7)),
    [monthlyMedians, cutoff]
  );

  const width = 720;
  const height = 280;
  const pad = { t: 16, r: 16, b: 32, l: 56 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;

  const prices =
    mode === 'trend'
      ? filteredMedians.map((m) => m.median)
      : filteredSales.map((s) => s.totalGbp);

  const empty = prices.length === 0;
  const min = empty ? 0 : Math.min(...prices) * 0.95;
  const max = empty ? 1 : Math.max(...prices) * 1.05;
  const span = max - min || 1;

  const xForDate = (date: string) => {
    const dates =
      mode === 'trend'
        ? filteredMedians.map((m) => `${m.month}-15`)
        : filteredSales.map((s) => s.date);
    if (dates.length <= 1) return pad.l + innerW / 2;
    const t0 = new Date(dates[0]).getTime();
    const t1 = new Date(dates[dates.length - 1]).getTime();
    const t = new Date(date).getTime();
    const frac = t1 === t0 ? 0.5 : (t - t0) / (t1 - t0);
    return pad.l + frac * innerW;
  };

  const yForPrice = (price: number) => pad.t + (1 - (price - min) / span) * innerH;

  const trendPoints = filteredMedians.map((m) => ({
    x: xForDate(`${m.month}-15`),
    y: yForPrice(m.median),
    date: `${m.month}-01`,
    price: m.median,
    label: `${m.count} sale${m.count === 1 ? '' : 's'}`,
  }));

  const salesPoints = filteredSales.map((s) => ({
    x: xForDate(s.date),
    y: yForPrice(s.totalGbp),
    date: s.date,
    price: s.totalGbp,
    label: `${s.house} · Lot ${s.lot}`,
  }));

  const points = mode === 'trend' ? trendPoints : salesPoints;
  const path = trendPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const active = hover != null ? points[hover] : points[points.length - 1];
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + span * (1 - t));
  const up =
    points.length >= 2 ? (points[points.length - 1]?.price ?? 0) >= (points[0]?.price ?? 0) : true;
  const stroke = up ? 'var(--up)' : 'var(--down)';

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Price History</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {currency} auction totals. Blank months = no sales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg bg-surface-muted p-1">
            {(
              [
                { id: 'trend', label: 'Trend' },
                { id: 'sales', label: 'Sales' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setHover(null);
                }}
                className={cn(
                  'rounded-md px-2.5 py-1 text-sm font-medium transition',
                  mode === m.id ? 'bg-white text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-lg bg-surface-muted p-1">
            {RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRange(r.id);
                  setHover(null);
                }}
                className={cn(
                  'rounded-md px-2 py-1 font-mono-num text-[11px] font-medium transition',
                  range === r.id ? 'bg-white text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-line">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="label-meta">
              {mode === 'trend' ? 'Monthly median (GBP)' : 'Sale total (GBP)'}
            </p>
            {empty ? (
              <p className="mt-1 text-sm text-ink-muted">No recorded sales in this period.</p>
            ) : (
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <p className="font-mono-num text-2xl font-semibold tracking-tight text-ink">
                  {formatGBP(active?.price ?? 0)}
                </p>
                <p className="text-sm text-ink-muted">
                  {active?.date
                    ? new Date(active.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                  {active?.label ? ` · ${active.label}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative px-2 pb-2 pt-3 sm:px-4">
          {empty ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 px-4 text-center">
              <p className="text-sm font-medium text-ink">No sales in this range</p>
              <p className="text-sm text-ink-muted">Try a longer window or switch to Sales.</p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-auto w-full"
              role="img"
              aria-label="Bottle price history chart"
              onMouseLeave={() => setHover(null)}
            >
              {yTicks.map((tick, i) => {
                const y = pad.t + (i / (yTicks.length - 1)) * innerH;
                return (
                  <g key={tick}>
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
                      style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    >
                      {formatGBP(tick, { compact: true })}
                    </text>
                  </g>
                );
              })}

              {mode === 'trend' && path && (
                <path d={path} fill="none" stroke={stroke} strokeWidth="2.25" strokeLinejoin="round" />
              )}

              {mode === 'trend' &&
                trendPoints.map((p, i) => (
                  <circle
                    key={p.date}
                    cx={p.x}
                    cy={p.y}
                    r={hover === i ? 5 : 3.5}
                    fill={stroke}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                ))}

              {mode === 'sales' &&
                salesPoints.map((p, i) => (
                  <circle
                    key={`${p.date}-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={hover === i ? 5.5 : 4}
                    fill="var(--ink)"
                    fillOpacity={0.72}
                    stroke="#fff"
                    strokeWidth="1.25"
                  />
                ))}

              {points.map((p, i) => (
                <rect
                  key={`hit-${p.date}-${i}`}
                  x={p.x - 10}
                  y={pad.t}
                  width={20}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
              ))}

              {active && (
                <>
                  <line
                    x1={active.x}
                    x2={active.x}
                    y1={pad.t}
                    y2={pad.t + innerH}
                    stroke="var(--ink-faint)"
                    strokeDasharray="3 4"
                  />
                  <g>
                    <rect
                      x={Math.min(Math.max(active.x - 70, pad.l), width - pad.r - 140)}
                      y={Math.max(pad.t + 4, active.y - 48)}
                      width="140"
                      height="40"
                      fill="#fff"
                      stroke="var(--line)"
                      strokeWidth="1"
                    />
                    <text
                      x={Math.min(Math.max(active.x - 70, pad.l), width - pad.r - 140) + 10}
                      y={Math.max(pad.t + 4, active.y - 48) + 16}
                      className="fill-[var(--ink)]"
                      style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    >
                      {formatGBP(active.price)}
                    </text>
                    <text
                      x={Math.min(Math.max(active.x - 70, pad.l), width - pad.r - 140) + 10}
                      y={Math.max(pad.t + 4, active.y - 48) + 30}
                      className="fill-[var(--ink-muted)]"
                      style={{ fontSize: 10, fontFamily: 'var(--font-sans)' }}
                    >
                      {(active.label || active.date).slice(0, 28)}
                    </text>
                  </g>
                </>
              )}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
