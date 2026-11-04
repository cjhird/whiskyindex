'use client';

import { useState } from 'react';

type Row = { month: string; turnover: number; volume: number };

export function ActivityBarChart({
  rows,
  metric,
}: {
  rows: Row[];
  metric: 'turnover' | 'volume';
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const height = 260;
  const pad = { t: 16, r: 12, b: 36, l: 56 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const values = rows.map((r) => (metric === 'turnover' ? r.turnover : r.volume));
  const max = Math.max(...values, 1);
  const barW = Math.max(4, (innerW / Math.max(rows.length, 1)) * 0.62);
  const gap = rows.length ? innerW / rows.length : innerW;

  const formatTick = (v: number) => {
    if (metric === 'turnover') {
      if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}m`;
      return `£${(v / 1000).toFixed(0)}k`;
    }
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return String(Math.round(v));
  };

  const yTicks = [0, 0.5, 1].map((t) => max * t);
  const active = hover != null ? rows[hover] : null;
  const activeValue =
    active == null ? null : metric === 'turnover' ? active.turnover : active.volume;

  if (rows.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center px-4 text-sm text-ink-muted">
        No activity in this range. Try a longer period.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-2.5">
        <p className="text-sm text-ink-muted">
          {active ? (
            <>
              <span className="font-medium text-ink">{active.month}</span>
              <span className="text-ink-faint"> · </span>
              {metric === 'turnover' ? 'Turnover' : 'Volume'}{' '}
              <span className="font-mono-num text-ink">{formatTick(activeValue ?? 0)}</span>
            </>
          ) : (
            <>
              <span className="font-medium text-ink">{rows[rows.length - 1]?.month}</span>
              <span className="text-ink-faint"> · </span>
              {metric === 'turnover' ? 'Turnover' : 'Volume'}{' '}
              <span className="font-mono-num text-ink">
                {formatTick(
                  metric === 'turnover'
                    ? rows[rows.length - 1]?.turnover ?? 0
                    : rows[rows.length - 1]?.volume ?? 0
                )}
              </span>
            </>
          )}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Trading activity chart"
        onMouseLeave={() => setHover(null)}
      >
        {yTicks.map((t) => {
          const y = pad.t + (1 - t / max) * innerH;
          return (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
              <text
                x={pad.l - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-[var(--ink-faint)]"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {formatTick(t)}
              </text>
            </g>
          );
        })}
        {rows.map((r, i) => {
          const v = metric === 'turnover' ? r.turnover : r.volume;
          const h = (v / max) * innerH;
          const x = pad.l + i * gap + (gap - barW) / 2;
          const y = pad.t + innerH - h;
          const isActive = hover === i;
          return (
            <g key={r.month}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill="var(--ink)"
                opacity={isActive ? 1 : hover == null ? 0.78 : 0.35}
                rx="1"
                onMouseEnter={() => setHover(i)}
              />
              <rect
                x={pad.l + i * gap}
                y={pad.t}
                width={gap}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
              {(i === 0 || i === rows.length - 1 || i % Math.ceil(rows.length / 6) === 0) && (
                <text
                  x={x + barW / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-[var(--ink-faint)]"
                  fontSize="9"
                >
                  {r.month.slice(2)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
