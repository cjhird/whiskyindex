'use client';

import { useMemo, useState } from 'react';
import type { PricePoint } from '@/lib/mock/types';
import { formatGBP } from '@/lib/format';

const RANGES = [
  { id: '6m', label: '6M', months: 6 },
  { id: '1y', label: '1Y', months: 12 },
  { id: '2y', label: '2Y', months: 24 },
  { id: 'all', label: 'ALL', months: 999 },
] as const;

export function PriceChart({ history, latestPrice }: { history: PricePoint[]; latestPrice: number }) {
  const [range, setRange] = useState<(typeof RANGES)[number]['id']>('1y');
  const [hover, setHover] = useState<number | null>(null);

  const data = useMemo(() => {
    const months = RANGES.find((r) => r.id === range)?.months ?? 12;
    if (months >= 999) return history;
    return history.slice(-months - 1);
  }, [history, range]);

  const width = 720;
  const height = 260;
  const pad = { t: 16, r: 16, b: 28, l: 56 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices) * 0.97;
  const max = Math.max(...prices) * 1.03;
  const span = max - min || 1;

  const points = data.map((d, i) => {
    const x = pad.l + (i / (data.length - 1 || 1)) * innerW;
    const y = pad.t + (1 - (d.price - min) / span) * innerH;
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${path} L${points[points.length - 1]?.x ?? 0},${pad.t + innerH} L${points[0]?.x ?? 0},${pad.t + innerH} Z`;
  const up = (prices.at(-1) ?? 0) >= (prices[0] ?? 0);
  const stroke = up ? 'var(--up)' : 'var(--down)';
  const fill = up ? 'rgba(15,122,69,0.12)' : 'rgba(192,41,43,0.10)';
  const active = hover != null ? points[hover] : points[points.length - 1];

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + span * (1 - t));

  return (
    <div className="surface overflow-hidden rounded-lg">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line bg-surface-muted px-5 py-4">
        <div>
          <p className="label-caps">Auction mark</p>
          <div className="mt-1 flex items-baseline gap-3">
            <p className="font-mono-num text-3xl font-semibold tracking-tight text-ink">
              {formatGBP(active?.price ?? latestPrice)}
            </p>
            <p className="text-sm text-ink-muted">
              {active?.date
                ? new Date(active.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Latest'}
            </p>
          </div>
        </div>
        <div className="flex gap-1 rounded-md border border-line bg-accent-soft p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded px-2.5 py-1 font-mono-num text-[11px] font-medium transition ${
                range === r.id ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative px-2 pb-2 pt-3 sm:px-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          onMouseLeave={() => setHover(null)}
        >
          {yTicks.map((tick, i) => {
            const y = pad.t + (i / (yTicks.length - 1)) * innerH;
            return (
              <g key={tick}>
                <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
                <text
                  x={pad.l - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-ink-faint"
                  style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                >
                  {formatGBP(tick, { compact: true })}
                </text>
              </g>
            );
          })}
          <path d={area} fill={fill} />
          <path d={path} fill="none" stroke={stroke} strokeWidth="2.25" strokeLinejoin="round" />
          {points.map((p, i) => (
            <rect
              key={p.date}
              x={p.x - innerW / data.length / 2}
              y={pad.t}
              width={Math.max(innerW / data.length, 8)}
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
              <circle cx={active.x} cy={active.y} r="4.5" fill={stroke} stroke="#fff" strokeWidth="2" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
