import { bottles, marketIndices } from './bottles';

/** Illustrative monthly snapshot — not real-time. */
export const marketSnapshot = {
  periodLabel: 'February 2026',
  updatedAt: '2026-03-01',
  updatedLabel: 'Updated 1 Mar 2026 · monthly close',
  turnoverGbp: 18_400_000,
  bottlesSold: 24_680,
  housesCovered: 12,
  index: marketIndices[0],
  disclaimer: 'Illustrative placeholder figures for product design — not live auction prints.',
};

/** 12-month WI Broad path derived from mock index level. */
export function marketIndexHistory(months = 12) {
  const end = marketSnapshot.index.value;
  const points: { date: string; value: number }[] = [];
  let v = end * 0.94;
  for (let i = months; i >= 0; i--) {
    const d = new Date('2026-03-01');
    d.setMonth(d.getMonth() - i);
    const wobble = Math.sin(i * 0.55) * 0.012 + Math.cos(i * 0.2) * 0.006;
    v = v * (1 + wobble) + (end - v) * 0.08;
    if (i === 0) v = end;
    points.push({ date: d.toISOString().slice(0, 10), value: Math.round(v * 10) / 10 });
  }
  return points;
}

export function discoverySets() {
  const performers = [...bottles]
    .sort((a, b) => b.change1y - a.change1y)
    .slice(0, 5)
    .map((b) => ({
      bottle: b,
      change: b.change1y,
      transactions: b.lotCount,
    }));

  const traded = [...bottles]
    .sort((a, b) => b.volume30d - a.volume30d)
    .slice(0, 5)
    .map((b) => ({
      bottle: b,
      change: b.change1y,
      transactions: b.lotCount,
    }));

  const declines = [...bottles]
    .sort((a, b) => a.change1y - b.change1y)
    .slice(0, 5)
    .map((b) => ({
      bottle: b,
      change: b.change1y,
      transactions: b.lotCount,
    }));

  return { performers, traded, declines };
}

export function heroPreviewMovers(limit = 4) {
  return [...bottles]
    .sort((a, b) => Math.abs(b.change1m) - Math.abs(a.change1m))
    .slice(0, limit);
}
