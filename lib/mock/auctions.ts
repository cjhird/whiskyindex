import { bottles } from './bottles';
import type { Bottle } from './types';

/** Demo clock for relative auction windows — illustrative only */
export const DATA_AS_OF = '2026-03-01';

export type AuctionComp = {
  id: string;
  house: string;
  lot: string;
  date: string;
  hammer: number;
  premium: number;
  total: number;
  currency: 'GBP' | 'EUR' | 'USD';
  /** Converted hammer+premium in GBP for comparison */
  totalGbp: number;
  condition: string;
  fillLevel?: string;
  lotUrl: string | null;
};

export type OrderBookLevel = {
  price: number;
  size: number;
};

export type LiquidityClass =
  | 'Frequently Traded'
  | 'Regularly Traded'
  | 'Infrequently Traded'
  | 'Rarely Seen at Auction';

export type BottleMarketStats = {
  latest: AuctionComp | null;
  median12m: number | null;
  median12mCount: number;
  change12mPct: number | null;
  change12mAvailable: boolean;
  sales12m: number;
  high12m: number | null;
  low12m: number | null;
  houses12m: number;
  totalHistorical: number;
  daysSinceLastSale: number | null;
  typicalDaysBetweenSales: number | null;
  liquidityClass: LiquidityClass;
  liquidityNote: string;
};

export type MonthlyVolume = {
  month: string;
  count: number;
};

export type MonthlyMedian = {
  month: string;
  median: number;
  count: number;
};

const HOUSES = [
  'Whisky Auctioneer',
  'Scotch Whisky Auctions',
  'Just Whisky',
  'Whisky Online Auctions',
  'Grand Whisky Auction',
];

const HOUSE_URL: Record<string, string> = {
  'Whisky Auctioneer': 'https://whiskyauctioneer.com',
  'Scotch Whisky Auctions': 'https://www.scotchwhiskyauctions.com',
  'Just Whisky': 'https://www.just-whisky.co.uk',
  'Whisky Online Auctions': 'https://www.whiskyonlineauctions.com',
  'Grand Whisky Auction': 'https://www.thegrandwhiskyauction.com',
};

const FX: Record<AuctionComp['currency'], number> = {
  GBP: 1,
  EUR: 0.86,
  USD: 0.79,
};

function seeded(n: number) {
  const x = Math.sin(n * 999) * 10000;
  return x - Math.floor(x);
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function asOfDate() {
  return new Date(`${DATA_AS_OF}T12:00:00Z`);
}

function daysBetween(a: string, b: string) {
  const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Liquidity classification — data-backed thresholds on 12-month sale count.
 * Low volume ≠ intrinsic rarity or value.
 */
export function classifyLiquidity(sales12m: number): { class: LiquidityClass; note: string } {
  if (sales12m >= 24) {
    return {
      class: 'Frequently Traded',
      note: '≥24 recorded single-bottle sales in the past 12 months.',
    };
  }
  if (sales12m >= 8) {
    return {
      class: 'Regularly Traded',
      note: '8–23 recorded single-bottle sales in the past 12 months.',
    };
  }
  if (sales12m >= 3) {
    return {
      class: 'Infrequently Traded',
      note: '3–7 recorded single-bottle sales in the past 12 months.',
    };
  }
  return {
    class: 'Rarely Seen at Auction',
    note: 'Fewer than 3 recorded single-bottle sales in the past 12 months. Low volume is not proof of rarity or value.',
  };
}

/** Full auction history for this exact canonical bottle (illustrative). */
export function getAuctionHistory(bottle: Bottle): AuctionComp[] {
  const count = Math.min(Math.max(bottle.lotCount, 4), 48);
  const comps: AuctionComp[] = [];
  const asOf = asOfDate();

  for (let i = 0; i < count; i++) {
    const r = seeded(bottle.latestPrice + i * 17 + bottle.id.charCodeAt(1));
    const r2 = seeded(bottle.latestPrice + i * 41);
    const liquiditySpan =
      bottle.liquidity === 'High' ? 14 : bottle.liquidity === 'Medium' ? 28 : 55;
    const drift = 1 + (r - 0.5) * 0.14 - (i / count) * 0.12;
    const hammer = Math.max(1, Math.round(bottle.latestPrice * drift * 0.91));
    const premium = Math.round(hammer * 0.12);
    const d = new Date(asOf);
    d.setDate(d.getDate() - Math.floor(i * liquiditySpan * (0.7 + r * 0.6)));
    const currency: AuctionComp['currency'] = r2 > 0.88 ? 'EUR' : r2 > 0.78 ? 'USD' : 'GBP';
    const total = hammer + premium;
    const totalGbp = Math.round(total * FX[currency]);
    const house = HOUSES[i % HOUSES.length];
    const lot = `${1200 + i * 37 + Math.floor(r * 9)}`;
    comps.push({
      id: `${bottle.id}-lot-${i}`,
      house,
      lot,
      date: d.toISOString().slice(0, 10),
      hammer,
      premium,
      total,
      currency,
      totalGbp,
      condition: r > 0.72 ? 'Box + papers' : r > 0.38 ? 'Original tube' : 'Bottle only',
      fillLevel: r > 0.85 ? 'Into neck' : r > 0.55 ? 'High shoulder' : undefined,
      lotUrl: `${HOUSE_URL[house]}/lot/${lot}`,
    });
  }

  return comps.sort((a, b) => b.date.localeCompare(a.date));
}

/** @deprecated Prefer getAuctionHistory — kept for recent-results feed */
export function getAuctionComps(bottle: Bottle, count = 8): AuctionComp[] {
  return getAuctionHistory(bottle).slice(0, count);
}

export function getOrderBook(bottle: Bottle): { bids: OrderBookLevel[]; asks: OrderBookLevel[] } {
  const mid = bottle.latestPrice;
  const bids = Array.from({ length: 5 }, (_, i) => ({
    price: Math.round(mid * (0.985 - i * 0.012)),
    size: Math.max(1, Math.round(seeded(mid + i) * 6)),
  }));
  const asks = Array.from({ length: 5 }, (_, i) => ({
    price: Math.round(mid * (1.015 + i * 0.012)),
    size: Math.max(1, Math.round(seeded(mid + i + 9) * 5)),
  }));
  return { bids, asks };
}

export function getBottleMarketStats(bottle: Bottle, history?: AuctionComp[]): BottleMarketStats {
  const rows = history ?? getAuctionHistory(bottle);
  const asOf = DATA_AS_OF;
  const cutoff = new Date(asOf);
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const last12 = rows.filter((r) => r.date >= cutoffStr);
  const prior12Start = new Date(cutoff);
  prior12Start.setFullYear(prior12Start.getFullYear() - 1);
  const prior12 = rows.filter(
    (r) => r.date >= prior12Start.toISOString().slice(0, 10) && r.date < cutoffStr
  );

  const median12m = median(last12.map((r) => r.totalGbp));
  const priorMedian = median(prior12.map((r) => r.totalGbp));
  const minObs = 3;
  const change12mAvailable =
    median12m != null && priorMedian != null && last12.length >= minObs && prior12.length >= minObs;
  const change12mPct =
    change12mAvailable && priorMedian
      ? Math.round(((median12m! - priorMedian) / priorMedian) * 1000) / 10
      : null;

  const latest = rows[0] ?? null;
  const daysSinceLastSale = latest ? daysBetween(latest.date, asOf) : null;

  let typicalDaysBetweenSales: number | null = null;
  if (rows.length >= 3) {
    const gaps: number[] = [];
    for (let i = 0; i < Math.min(rows.length - 1, 24); i++) {
      gaps.push(daysBetween(rows[i].date, rows[i + 1].date));
    }
    typicalDaysBetweenSales = median(gaps);
  }

  const houses12m = new Set(last12.map((r) => r.house)).size;
  const { class: liquidityClass, note: liquidityNote } = classifyLiquidity(last12.length);

  return {
    latest,
    median12m,
    median12mCount: last12.length,
    change12mPct,
    change12mAvailable,
    sales12m: last12.length,
    high12m: last12.length ? Math.max(...last12.map((r) => r.totalGbp)) : null,
    low12m: last12.length ? Math.min(...last12.map((r) => r.totalGbp)) : null,
    houses12m,
    totalHistorical: rows.length,
    daysSinceLastSale,
    typicalDaysBetweenSales,
    liquidityClass,
    liquidityNote,
  };
}

/** Monthly sale counts — only months with observations. */
export function getMonthlyVolume(bottle: Bottle, history?: AuctionComp[]): MonthlyVolume[] {
  const rows = history ?? getAuctionHistory(bottle);
  const map = new Map<string, number>();
  for (const r of rows) {
    const month = r.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/** Monthly median hammer+premium (GBP) — only months with actual sales. */
export function getMonthlyMedians(bottle: Bottle, history?: AuctionComp[]): MonthlyMedian[] {
  const rows = history ?? getAuctionHistory(bottle);
  const map = new Map<string, number[]>();
  for (const r of rows) {
    const month = r.date.slice(0, 7);
    const arr = map.get(month) ?? [];
    arr.push(r.totalGbp);
    map.set(month, arr);
  }
  return Array.from(map.entries())
    .map(([month, prices]) => ({
      month,
      median: median(prices)!,
      count: prices.length,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getComparableBottles(bottle: Bottle, all: Bottle[] = bottles, limit = 5) {
  return all
    .filter((b) => b.id !== bottle.id)
    .map((b) => {
      const ageScore =
        bottle.ageYears != null && b.ageYears != null
          ? Math.max(0, 4 - Math.abs(b.ageYears - bottle.ageYears) / 3)
          : 0;
      const priceScore =
        3 - Math.min(3, Math.abs(b.latestPrice - bottle.latestPrice) / Math.max(bottle.latestPrice, 1) * 6);
      const score =
        (b.distillery === bottle.distillery ? 8 : 0) +
        (b.brand === bottle.brand ? 4 : 0) +
        (b.region === bottle.region ? 3 : 0) +
        (b.country === bottle.country ? 1 : 0) +
        (b.edition && bottle.edition && b.edition === bottle.edition ? 2 : 0) +
        ageScore +
        priceScore;
      return { bottle: b, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.bottle);
}

/** @deprecated Prefer getComparableBottles */
export function getRelatedBottles(bottle: Bottle, all: Bottle[], limit = 4) {
  return getComparableBottles(bottle, all, limit);
}

export type AuctionResultRow = AuctionComp & {
  bottleSlug: string;
  bottleName: string;
  brand: string;
};

/** Flat recent auction results across the mock bottle universe. */
export function getRecentAuctionResults(limit = 40): AuctionResultRow[] {
  const rows: AuctionResultRow[] = [];
  for (const bottle of bottles) {
    for (const comp of getAuctionHistory(bottle).slice(0, 3)) {
      rows.push({
        ...comp,
        bottleSlug: bottle.slug,
        bottleName: bottle.name,
        brand: bottle.brand,
      });
    }
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function relatedInsightArticles(
  bottle: Bottle,
  articles: Array<{ slug: string; title: string; excerpt: string; category: string; publishedAt: string; readMinutes: number; cover: string }>,
  limit = 3
) {
  const tokens = [
    bottle.brand.toLowerCase(),
    bottle.distillery.toLowerCase(),
    bottle.region.toLowerCase(),
    bottle.country.toLowerCase(),
  ];
  return articles
    .map((a) => {
      const hay = `${a.title} ${a.excerpt}`.toLowerCase();
      const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 2 : 0), 0) +
        (a.category === 'Guide' || a.category === 'Analysis' ? 1 : 0);
      return { article: a, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.article.publishedAt.localeCompare(a.article.publishedAt))
    .slice(0, limit)
    .map((x) => x.article);
}
