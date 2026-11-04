import { bottles, distilleries, marketIndices, slugifyName } from './bottles';
import { getRecentAuctionResults } from './auctions';
import { articles } from './articles';

/** Illustrative monthly snapshot — not live auction prints. */
export const marketSnapshot = {
  periodLabel: 'February 2026',
  updatedAt: '2026-03-01',
  updatedLabel: 'Updated 1 Mar 2026 · monthly close',
  turnoverGbp: 18_400_000,
  turnoverChangePct: 4.2,
  bottlesSold: 24_680,
  bottlesSoldChangePct: 2.8,
  uniqueBottles: 6_140,
  uniqueBottlesChangePct: 1.6,
  activeDistilleries: 186,
  activeDistilleriesChangePct: 0.5,
  housesCovered: 12,
  index: marketIndices[0],
  disclaimer: 'Illustrative placeholder figures for product design — not live auction prints.',
  houses: [
    'Whisky Auctioneer',
    'Scotch Whisky Auctions',
    'Just Whisky',
    'Whisky Online Auctions',
    'Grand Whisky Auction',
    'Whisky Hammer',
  ],
  priceBasis: 'Buyer-inclusive totals (hammer + buyer premium) where recorded',
  currencyNote: 'Non-GBP lots converted at month-end FX for aggregation',
  updateCadence: 'Monthly close — not real-time',
};

export type PeriodId = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export const PERIODS: { id: PeriodId; label: string; months: number }[] = [
  { id: '1M', label: '1M', months: 1 },
  { id: '3M', label: '3M', months: 3 },
  { id: '6M', label: '6M', months: 6 },
  { id: '1Y', label: '1Y', months: 12 },
  { id: '3Y', label: '3Y', months: 36 },
  { id: '5Y', label: '5Y', months: 60 },
  { id: 'ALL', label: 'ALL', months: 72 },
];

function monthDate(offset: number) {
  const d = new Date('2026-03-01');
  d.setMonth(d.getMonth() - offset);
  return d.toISOString().slice(0, 7);
}

/** Monthly illustrative auction activity series (turnover + volume). */
export function tradingActivitySeries(months = 24) {
  const rows: { month: string; turnover: number; volume: number; houses: number }[] = [];
  for (let i = months; i >= 1; i--) {
    const season = 1 + Math.sin(i * 0.45) * 0.08;
    const trend = 1 + (months - i) * 0.004;
    const turnover = Math.round(14_200_000 * season * trend * (0.92 + ((i * 17) % 10) / 100));
    const volume = Math.round(19_500 * season * trend * (0.9 + ((i * 13) % 12) / 100));
    rows.push({
      month: monthDate(i),
      turnover,
      volume,
      houses: 9 + (i % 4),
    });
  }
  return rows;
}

export function sliceActivity(period: PeriodId) {
  const months = PERIODS.find((p) => p.id === period)?.months ?? 12;
  return tradingActivitySeries(Math.max(months, 12)).slice(-months);
}

export function activityChange(period: PeriodId) {
  const rows = sliceActivity(period);
  if (rows.length < 2) return { turnoverPct: 0, volumePct: 0 };
  const half = Math.floor(rows.length / 2) || 1;
  const recent = rows.slice(-half);
  const prior = rows.slice(0, half);
  const sum = (xs: typeof rows, key: 'turnover' | 'volume') => xs.reduce((s, r) => s + r[key], 0);
  const tR = sum(recent, 'turnover');
  const tP = sum(prior, 'turnover') || 1;
  const vR = sum(recent, 'volume');
  const vP = sum(prior, 'volume') || 1;
  return {
    turnoverPct: ((tR - tP) / tP) * 100,
    volumePct: ((vR - vP) / vP) * 100,
  };
}

/** Kept for homepage glance — clearly illustrative, not a production index. */
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

export type SegmentKind = 'region' | 'distillery' | 'country';

export function marketSegments(kind: SegmentKind) {
  const map = new Map<
    string,
    { name: string; slug?: string; turnover: number; bottlesSold: number; avgLot: number }
  >();

  for (const b of bottles) {
    const name = kind === 'region' ? b.region : kind === 'country' ? b.country : b.distillery;
    const key = name;
    const prev = map.get(key);
    const lotProxy = Math.max(1, b.volume30d) * b.latestPrice;
    const soldProxy = Math.max(1, b.volume30d);
    if (prev) {
      prev.turnover += lotProxy;
      prev.bottlesSold += soldProxy;
    } else {
      map.set(key, {
        name,
        slug: kind === 'distillery' ? slugifyName(b.distillery) : undefined,
        turnover: lotProxy,
        bottlesSold: soldProxy,
        avgLot: b.latestPrice,
      });
    }
  }

  const rows = Array.from(map.values()).map((r) => ({
    ...r,
    avgLot: r.turnover / Math.max(r.bottlesSold, 1),
  }));
  const totalTurnover = rows.reduce((s, r) => s + r.turnover, 0) || 1;
  return rows
    .map((r) => ({
      ...r,
      sharePct: (r.turnover / totalTurnover) * 100,
    }))
    .sort((a, b) => b.turnover - a.turnover);
}

export function mostTradedBottles(limit = 8) {
  return [...bottles]
    .filter((b) => b.lotCount >= 8)
    .sort((a, b) => b.volume30d - a.volume30d || b.lotCount - a.lotCount)
    .slice(0, limit)
    .map((b) => ({
      bottle: b,
      transactions: b.lotCount,
      recentVolume: b.volume30d,
    }));
}

export function topAuctionHouses(limit = 5) {
  const results = getRecentAuctionResults(80);
  const map = new Map<string, { house: string; lots: number; turnover: number }>();
  for (const r of results) {
    const prev = map.get(r.house);
    if (prev) {
      prev.lots += 1;
      prev.turnover += r.total;
    } else {
      map.set(r.house, { house: r.house, lots: 1, turnover: r.total });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.turnover - a.turnover)
    .slice(0, limit);
}

export function highestValueRecentSales(limit = 5) {
  return getRecentAuctionResults(80)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export function latestTransactions(limit = 6) {
  return getRecentAuctionResults(limit);
}

export function marketInsightArticles(limit = 3) {
  return [...articles]
    .filter((a) => a.category === 'Market Report' || a.category === 'Analysis' || a.category === 'News')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
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

export { distilleries, marketIndices };
