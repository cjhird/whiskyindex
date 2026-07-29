import type {
  BottleMetrics,
  PriceObservation,
  SearchBottlesParams,
  SearchBottlesRow,
} from "@whiskyindex/schemas";
import { mockBottles, mockPriceObservations } from "./fixtures/bottles";

function latestPriceForBottle(bottleId: string): number | null {
  const obs = mockPriceObservations
    .filter((o) => o.bottle_id === bottleId)
    .sort((a, b) => b.observed_at.localeCompare(a.observed_at));
  return obs[0]?.total_price ?? null;
}

export function searchBottlesMock(params: SearchBottlesParams): SearchBottlesRow[] {
  const sort = params.sort ?? "latest_price_desc";
  const page = params.page ?? 1;
  const pageSize = params.page_size ?? 20;

  let rows: SearchBottlesRow[] = mockBottles.map((bottle) => ({
    ...bottle,
    latest_price: latestPriceForBottle(bottle.id),
    total_count: 0,
  }));

  if (params.q) {
    const q = params.q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.brand.toLowerCase().includes(q)
    );
  }

  if (params.brand) {
    rows = rows.filter((r) => r.brand === params.brand);
  }

  if (params.region) {
    rows = rows.filter((r) => r.region === params.region);
  }

  if (params.country) {
    rows = rows.filter((r) => r.country === params.country);
  }

  if (params.min_price != null) {
    rows = rows.filter((r) => (r.latest_price ?? 0) >= params.min_price!);
  }

  if (params.max_price != null) {
    rows = rows.filter(
      (r) => r.latest_price != null && r.latest_price <= params.max_price!
    );
  }

  const totalCount = rows.length;

  rows.sort((a, b) => {
    switch (sort) {
      case "latest_price_asc":
        return (a.latest_price ?? 0) - (b.latest_price ?? 0);
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "brand_asc":
        return a.brand.localeCompare(b.brand);
      case "latest_price_desc":
      default:
        return (b.latest_price ?? 0) - (a.latest_price ?? 0);
    }
  });

  const start = (page - 1) * pageSize;
  const paged = rows.slice(start, start + pageSize);

  return paged.map((row) => ({ ...row, total_count: totalCount }));
}

export function getBottleByIdMock(id: string) {
  return mockBottles.find((b) => b.id === id) ?? null;
}

export function getPriceObservationsForBottleMock(bottleId: string): PriceObservation[] {
  return mockPriceObservations
    .filter((o) => o.bottle_id === bottleId)
    .sort((a, b) => a.observed_at.localeCompare(b.observed_at));
}

export function getBottleMetricsMock(bottleId: string): BottleMetrics {
  const observations = getPriceObservationsForBottleMock(bottleId);
  const count = observations.length;

  if (count === 0) {
    return {
      latest_price: null,
      latest_date: null,
      change_30d_pct: null,
      change_90d_pct: null,
      change_365d_pct: null,
      num_observations: 0,
      simple_volatility: null,
    };
  }

  const latest = observations[observations.length - 1];
  if (!latest) {
    return {
      latest_price: null,
      latest_date: null,
      change_30d_pct: null,
      change_90d_pct: null,
      change_365d_pct: null,
      num_observations: count,
      simple_volatility: null,
    };
  }

  const latestPrice = latest.total_price;
  const latestDate = latest.observed_at;

  const findNearest = (daysBack: number) => {
    const target = new Date(latestDate);
    target.setDate(target.getDate() - daysBack);
    const targetStr = target.toISOString().slice(0, 10);
    let best: PriceObservation | null = null;
    for (const obs of observations) {
      if (obs.observed_at <= targetStr) {
        best = obs;
      }
    }
    return best?.total_price ?? null;
  };

  const pctChange = (oldPrice: number | null) => {
    if (oldPrice == null || oldPrice <= 0) return null;
    return Math.round(((latestPrice - oldPrice) / oldPrice) * 10000) / 100;
  };

  const changes: number[] = [];
  for (let i = 1; i < observations.length; i++) {
    const prevObs = observations[i - 1];
    const currObs = observations[i];
    if (!prevObs || !currObs) continue;
    const prev = prevObs.total_price;
    const curr = currObs.total_price;
    if (prev > 0) {
      changes.push((curr - prev) / prev);
    }
  }

  const mean =
    changes.length > 0
      ? changes.reduce((sum, c) => sum + c, 0) / changes.length
      : 0;
  const variance =
    changes.length > 0
      ? changes.reduce((sum, c) => sum + (c - mean) ** 2, 0) / changes.length
      : 0;

  return {
    latest_price: latestPrice,
    latest_date: latestDate,
    change_30d_pct: pctChange(findNearest(30)),
    change_90d_pct: pctChange(findNearest(90)),
    change_365d_pct: pctChange(findNearest(365)),
    num_observations: count,
    simple_volatility: Math.round(Math.sqrt(variance) * 10000) / 10000,
  };
}
