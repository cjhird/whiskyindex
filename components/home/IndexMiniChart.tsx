'use client';

type Point = { date: string; value: number };

export function IndexMiniChart({
  points,
  className = '',
}: {
  points: Point[];
  className?: string;
}) {
  const width = 640;
  const height = 180;
  const pad = { t: 12, r: 8, b: 24, l: 40 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const values = points.map((p) => p.value);
  const min = Math.min(...values) * 0.995;
  const max = Math.max(...values) * 1.005;
  const span = max - min || 1;

  const plotted = points.map((p, i) => {
    const x = pad.l + (i / (points.length - 1 || 1)) * innerW;
    const y = pad.t + (1 - (p.value - min) / span) * innerH;
    return { x, y, ...p };
  });

  const path = plotted.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${path} L${plotted.at(-1)?.x ?? 0},${pad.t + innerH} L${plotted[0]?.x ?? 0},${pad.t + innerH} Z`;
  const up = (values.at(-1) ?? 0) >= (values[0] ?? 0);
  const stroke = up ? 'var(--up)' : 'var(--down)';
  const fill = up ? 'rgba(27,127,74,0.12)' : 'rgba(184,58,60,0.10)';
  const yTicks = [min, (min + max) / 2, max];

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Market index chart">
        {yTicks.map((t) => {
          const y = pad.t + (1 - (t - min) / span) * innerH;
          return (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 3} textAnchor="end" className="fill-[var(--ink-faint)]" fontSize="10" fontFamily="var(--font-mono)">
                {t.toFixed(0)}
              </text>
            </g>
          );
        })}
        <path d={area} fill={fill} />
        <path d={path} fill="none" stroke={stroke} strokeWidth="2" />
        <text x={pad.l} y={height - 6} className="fill-[var(--ink-faint)]" fontSize="10">
          {points[0]?.date.slice(0, 7)}
        </text>
        <text x={width - pad.r} y={height - 6} textAnchor="end" className="fill-[var(--ink-faint)]" fontSize="10">
          {points.at(-1)?.date.slice(0, 7)}
        </text>
      </svg>
    </div>
  );
}
