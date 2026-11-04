'use client';

type Row = { month: string; turnover: number; volume: number };

export function ActivityBarChart({
  rows,
  metric,
}: {
  rows: Row[];
  metric: 'turnover' | 'volume';
}) {
  const width = 720;
  const height = 260;
  const pad = { t: 16, r: 12, b: 36, l: 56 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const values = rows.map((r) => (metric === 'turnover' ? r.turnover : r.volume));
  const max = Math.max(...values, 1);
  const barW = Math.max(4, (innerW / rows.length) * 0.62);
  const gap = innerW / rows.length;

  const formatTick = (v: number) => {
    if (metric === 'turnover') {
      if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(0)}m`;
      return `£${(v / 1000).toFixed(0)}k`;
    }
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return String(Math.round(v));
  };

  const yTicks = [0, 0.5, 1].map((t) => max * t);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Trading activity chart">
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
        return (
          <g key={r.month}>
            <rect x={x} y={y} width={barW} height={h} fill="var(--ink)" opacity={0.78} rx="1">
              <title>
                {r.month}: {formatTick(v)}
              </title>
            </rect>
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
  );
}
