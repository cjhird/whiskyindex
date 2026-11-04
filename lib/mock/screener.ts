import { bottles, brands, countries, regions } from './bottles';
import type { Bottle } from './types';
import { marketSnapshot } from './market';

/** Minimum recorded lots before we surface 12M % change as usable. */
export const MIN_TXNS_FOR_PERFORMANCE = 12;

export type ScreenerRow = Bottle & {
  bottler: 'Official' | 'Independent';
  median12m: number | null;
  sales12m: number;
  lastSold: string | null;
  housesCount: number;
  change12m: number | null;
  histMin: number | null;
  histMax: number | null;
};

export type ScreenerFilters = {
  q?: string;
  distillery?: string[];
  /** Brand filter — also accepted via legacy `brand=` query */
  brand?: string[];
  country?: string[];
  region?: string[];
  bottler?: string;
  minAge?: number;
  maxAge?: number;
  minVintage?: number;
  maxVintage?: number;
  minAbv?: number;
  maxAbv?: number;
  size?: number;
  cask?: string;
  minPrice?: number;
  maxPrice?: number;
  minMedian?: number;
  maxMedian?: number;
  minChange12m?: number;
  maxChange12m?: number;
  minSales?: number;
  maxSales?: number;
  liquidity?: string;
  lastSoldAfter?: string;
  preset?: string;
  sort?: string;
  page?: number;
};

export const SCREENER_PAGE_SIZE = 10;

export const PRESETS: {
  id: string;
  label: string;
  description: string;
  apply: Partial<ScreenerFilters>;
}[] = [
  {
    id: 'most-traded',
    label: 'Most Traded',
    description: 'Highest recorded transaction volume',
    apply: { sort: 'sales12m_desc', minSales: 20 },
  },
  {
    id: 'top-performers',
    label: 'Top Performers',
    description: 'Strongest 12M change · min sample',
    apply: { sort: 'change12m_desc', minSales: MIN_TXNS_FOR_PERFORMANCE, minChange12m: 0 },
  },
  {
    id: 'biggest-declines',
    label: 'Biggest Declines',
    description: 'Largest 12M decreases · min sample',
    apply: { sort: 'change12m_asc', minSales: MIN_TXNS_FOR_PERFORMANCE, maxChange12m: 0 },
  },
  {
    id: 'recently-traded',
    label: 'Recently Traded',
    description: 'Sold within the last ~90 days',
    apply: { sort: 'last_sold_desc', lastSoldAfter: '2025-12-01' },
  },
  {
    id: 'high-value',
    label: 'High-Value Bottles',
    description: 'Latest auction price ≥ £1,000',
    apply: { sort: 'latest_price_desc', minPrice: 1000 },
  },
];

function median(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function toScreenerRow(b: Bottle): ScreenerRow {
  const window = b.history.slice(-13);
  const prices = window.map((h) => h.price);
  const med = median(prices);
  const reliable = b.lotCount >= MIN_TXNS_FOR_PERFORMANCE;
  return {
    ...b,
    bottler: b.officialBottling ? 'Official' : 'Independent',
    median12m: med != null ? Math.round(med) : null,
    sales12m: Math.max(b.volume30d * 4, Math.round(b.lotCount * 0.35)),
    lastSold: b.history.at(-1)?.date ?? null,
    housesCount: Math.min(6, 1 + (b.lotCount % 5)),
    change12m: reliable ? b.change1y : null,
    histMin: prices.length ? Math.round(Math.min(...prices)) : null,
    histMax: prices.length ? Math.round(Math.max(...prices)) : null,
  };
}

export const screenerUniverse: ScreenerRow[] = bottles.map(toScreenerRow);

export const screenerMeta = {
  updatedLabel: marketSnapshot.updatedLabel,
  periodLabel: `${marketSnapshot.periodLabel} close`,
  priceBasis: 'Buyer-inclusive totals where recorded.',
  disclaimer: marketSnapshot.disclaimer,
};

export function distillersList() {
  return Array.from(new Set(bottles.map((b) => b.distillery))).sort();
}

export function caskTypes() {
  return Array.from(new Set(bottles.map((b) => b.caskType))).sort();
}

export function bottleSizes() {
  return Array.from(new Set(bottles.map((b) => b.volumeMl))).sort((a, b) => a - b);
}

export function parseScreenerParams(sp: URLSearchParams): ScreenerFilters {
  const list = (key: string) => {
    const v = sp.get(key);
    if (!v) return undefined;
    return v.split(',').map((s) => s.trim()).filter(Boolean);
  };
  const num = (key: string) => {
    const v = sp.get(key);
    if (v == null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  // Legacy `brand=` deep-links alias into distillery when distillery is absent
  const brand = list('brand');
  const distilleryRaw = list('distillery');
  const distillery =
    distilleryRaw?.length
      ? distilleryRaw
      : brand?.length
        ? brand
        : undefined;

  return {
    q: sp.get('q') || undefined,
    distillery,
    brand: distilleryRaw?.length ? brand : undefined,
    country: list('country'),
    region: list('region'),
    bottler: sp.get('bottler') || undefined,
    // Prefer snake_case; accept camelCase aliases from older deep-links
    minAge: num('min_age') ?? num('minAge'),
    maxAge: num('max_age') ?? num('maxAge'),
    minVintage: num('min_vintage') ?? num('minVintage'),
    maxVintage: num('max_vintage') ?? num('maxVintage'),
    minAbv: num('min_abv') ?? num('minAbv'),
    maxAbv: num('max_abv') ?? num('maxAbv'),
    size: num('size'),
    cask: sp.get('cask') || undefined,
    minPrice: num('min_price') ?? num('minPrice'),
    maxPrice: num('max_price') ?? num('maxPrice'),
    minMedian: num('min_median'),
    maxMedian: num('max_median'),
    minChange12m: num('min_change12m'),
    maxChange12m: num('max_change12m'),
    minSales: num('min_sales'),
    maxSales: num('max_sales'),
    liquidity: sp.get('liquidity') || undefined,
    lastSoldAfter: sp.get('last_sold_after') || undefined,
    preset: sp.get('preset') || undefined,
    sort: sp.get('sort') || 'latest_price_desc',
    page: num('page') || 1,
  };
}

export function filtersToParams(f: ScreenerFilters): URLSearchParams {
  const p = new URLSearchParams();
  const set = (k: string, v?: string | number | null) => {
    if (v == null || v === '') return;
    p.set(k, String(v));
  };
  const setList = (k: string, v?: string[]) => {
    if (!v?.length) return;
    p.set(k, v.join(','));
  };
  set('q', f.q);
  setList('distillery', f.distillery);
  setList('brand', f.brand);
  setList('country', f.country);
  setList('region', f.region);
  set('bottler', f.bottler);
  set('min_age', f.minAge);
  set('max_age', f.maxAge);
  set('min_vintage', f.minVintage);
  set('max_vintage', f.maxVintage);
  set('min_abv', f.minAbv);
  set('max_abv', f.maxAbv);
  set('size', f.size);
  set('cask', f.cask);
  set('min_price', f.minPrice);
  set('max_price', f.maxPrice);
  set('min_median', f.minMedian);
  set('max_median', f.maxMedian);
  set('min_change12m', f.minChange12m);
  set('max_change12m', f.maxChange12m);
  set('min_sales', f.minSales);
  set('max_sales', f.maxSales);
  set('liquidity', f.liquidity);
  set('last_sold_after', f.lastSoldAfter);
  set('preset', f.preset);
  if (f.sort && f.sort !== 'latest_price_desc') set('sort', f.sort);
  if (f.page && f.page > 1) set('page', f.page);
  return p;
}

export function screenBottles(filters: ScreenerFilters) {
  let rows = [...screenerUniverse];
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.distillery.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q)
    );
  }
  if (filters.distillery?.length) {
    rows = rows.filter((b) => filters.distillery!.includes(b.distillery));
  }
  if (filters.brand?.length) {
    rows = rows.filter((b) => filters.brand!.includes(b.brand));
  }
  if (filters.country?.length) {
    rows = rows.filter((b) => filters.country!.includes(b.country));
  }
  if (filters.region?.length) {
    rows = rows.filter((b) => filters.region!.includes(b.region));
  }
  if (filters.bottler) rows = rows.filter((b) => b.bottler === filters.bottler);
  if (filters.minAge != null) rows = rows.filter((b) => (b.ageYears ?? -1) >= filters.minAge!);
  if (filters.maxAge != null) rows = rows.filter((b) => (b.ageYears ?? 999) <= filters.maxAge!);
  if (filters.minVintage != null) {
    rows = rows.filter((b) => (b.releaseYear ?? 0) >= filters.minVintage!);
  }
  if (filters.maxVintage != null) {
    rows = rows.filter((b) => (b.releaseYear ?? 9999) <= filters.maxVintage!);
  }
  if (filters.minAbv != null) rows = rows.filter((b) => b.abv >= filters.minAbv!);
  if (filters.maxAbv != null) rows = rows.filter((b) => b.abv <= filters.maxAbv!);
  if (filters.size != null) rows = rows.filter((b) => b.volumeMl === filters.size);
  if (filters.cask) rows = rows.filter((b) => b.caskType === filters.cask);
  if (filters.minPrice != null) rows = rows.filter((b) => b.latestPrice >= filters.minPrice!);
  if (filters.maxPrice != null) rows = rows.filter((b) => b.latestPrice <= filters.maxPrice!);
  if (filters.minMedian != null) {
    rows = rows.filter((b) => b.median12m != null && b.median12m >= filters.minMedian!);
  }
  if (filters.maxMedian != null) {
    rows = rows.filter((b) => b.median12m != null && b.median12m <= filters.maxMedian!);
  }
  if (filters.minChange12m != null) {
    rows = rows.filter((b) => b.change12m != null && b.change12m >= filters.minChange12m!);
  }
  if (filters.maxChange12m != null) {
    rows = rows.filter((b) => b.change12m != null && b.change12m <= filters.maxChange12m!);
  }
  if (filters.minSales != null) rows = rows.filter((b) => b.sales12m >= filters.minSales!);
  if (filters.maxSales != null) rows = rows.filter((b) => b.sales12m <= filters.maxSales!);
  if (filters.liquidity) rows = rows.filter((b) => b.liquidity === filters.liquidity);
  if (filters.lastSoldAfter) {
    rows = rows.filter((b) => b.lastSold && b.lastSold >= filters.lastSoldAfter!);
  }

  const sort = filters.sort || 'latest_price_desc';
  rows.sort((a, b) => {
    switch (sort) {
      case 'latest_price_asc':
        return a.latestPrice - b.latestPrice;
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'change12m_desc':
        return (b.change12m ?? -Infinity) - (a.change12m ?? -Infinity);
      case 'change12m_asc':
        return (a.change12m ?? Infinity) - (b.change12m ?? Infinity);
      case 'sales12m_desc':
        return b.sales12m - a.sales12m;
      case 'median12m_desc':
        return (b.median12m ?? 0) - (a.median12m ?? 0);
      case 'last_sold_desc':
        return (b.lastSold ?? '').localeCompare(a.lastSold ?? '');
      case 'age_desc':
        return (b.ageYears ?? 0) - (a.ageYears ?? 0);
      default:
        return b.latestPrice - a.latestPrice;
    }
  });

  const page = Math.max(1, filters.page || 1);
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / SCREENER_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * SCREENER_PAGE_SIZE;
  return {
    rows: rows.slice(start, start + SCREENER_PAGE_SIZE),
    total,
    page: safePage,
    pageCount,
    allMatching: rows,
  };
}

export function activeFilterChips(f: ScreenerFilters): { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];
  if (f.q) chips.push({ key: 'q', label: `Search: “${f.q}”` });
  if (f.preset) {
    const p = PRESETS.find((x) => x.id === f.preset);
    if (p) chips.push({ key: 'preset', label: `Preset: ${p.label}` });
  }
  f.distillery?.forEach((d, i) => chips.push({ key: `distillery:${i}`, label: `Distillery: ${d}` }));
  f.brand?.forEach((d, i) => chips.push({ key: `brand:${i}`, label: `Brand: ${d}` }));
  f.country?.forEach((d, i) => chips.push({ key: `country:${i}`, label: `Country: ${d}` }));
  f.region?.forEach((d, i) => chips.push({ key: `region:${i}`, label: `Region: ${d}` }));
  if (f.bottler) chips.push({ key: 'bottler', label: `Bottler: ${f.bottler}` });
  if (f.minAge != null || f.maxAge != null) {
    chips.push({
      key: 'age',
      label: `Age: ${f.minAge ?? '—'}–${f.maxAge ?? '—'}`,
    });
  }
  if (f.minVintage != null || f.maxVintage != null) {
    chips.push({
      key: 'vintage',
      label: `Vintage: ${f.minVintage ?? '—'}–${f.maxVintage ?? '—'}`,
    });
  }
  if (f.minAbv != null || f.maxAbv != null) {
    chips.push({ key: 'abv', label: `ABV: ${f.minAbv ?? '—'}–${f.maxAbv ?? '—'}%` });
  }
  if (f.size) chips.push({ key: 'size', label: `Size: ${f.size}ml` });
  if (f.cask) chips.push({ key: 'cask', label: `Cask: ${f.cask}` });
  if (f.minPrice != null || f.maxPrice != null) {
    chips.push({
      key: 'price',
      label: `Price: £${f.minPrice ?? '—'}–£${f.maxPrice ?? '—'}`,
    });
  }
  if (f.minMedian != null || f.maxMedian != null) {
    chips.push({
      key: 'median',
      label: `12M median: £${f.minMedian ?? '—'}–£${f.maxMedian ?? '—'}`,
    });
  }
  if (f.minChange12m != null || f.maxChange12m != null) {
    chips.push({
      key: 'change12m',
      label: `12M change: ${f.minChange12m ?? '—'}%–${f.maxChange12m ?? '—'}%`,
    });
  }
  if (f.minSales != null || f.maxSales != null) {
    chips.push({
      key: 'sales',
      label: `12M sales: ${f.minSales ?? '—'}–${f.maxSales ?? '—'}`,
    });
  }
  if (f.liquidity) chips.push({ key: 'liquidity', label: `Liquidity: ${f.liquidity}` });
  if (f.lastSoldAfter) chips.push({ key: 'last_sold_after', label: `Last sold after ${f.lastSoldAfter}` });
  return chips;
}

export function clearChip(f: ScreenerFilters, key: string): ScreenerFilters {
  const next = { ...f, page: 1 };
  if (key === 'q') delete next.q;
  else if (key === 'preset') {
    delete next.preset;
    // keep other fields user may have edited
  } else if (key.startsWith('distillery:')) {
    const i = Number(key.split(':')[1]);
    next.distillery = next.distillery?.filter((_, idx) => idx !== i);
    if (!next.distillery?.length) delete next.distillery;
  } else if (key.startsWith('brand:')) {
    const i = Number(key.split(':')[1]);
    next.brand = next.brand?.filter((_, idx) => idx !== i);
    if (!next.brand?.length) delete next.brand;
  } else if (key.startsWith('country:')) {
    const i = Number(key.split(':')[1]);
    next.country = next.country?.filter((_, idx) => idx !== i);
    if (!next.country?.length) delete next.country;
  } else if (key.startsWith('region:')) {
    const i = Number(key.split(':')[1]);
    next.region = next.region?.filter((_, idx) => idx !== i);
    if (!next.region?.length) delete next.region;
  } else if (key === 'bottler') delete next.bottler;
  else if (key === 'age') {
    delete next.minAge;
    delete next.maxAge;
  } else if (key === 'vintage') {
    delete next.minVintage;
    delete next.maxVintage;
  } else if (key === 'abv') {
    delete next.minAbv;
    delete next.maxAbv;
  } else if (key === 'size') delete next.size;
  else if (key === 'cask') delete next.cask;
  else if (key === 'price') {
    delete next.minPrice;
    delete next.maxPrice;
  } else if (key === 'median') {
    delete next.minMedian;
    delete next.maxMedian;
  } else if (key === 'change12m') {
    delete next.minChange12m;
    delete next.maxChange12m;
  } else if (key === 'sales') {
    delete next.minSales;
    delete next.maxSales;
  } else if (key === 'liquidity') delete next.liquidity;
  else if (key === 'last_sold_after') delete next.lastSoldAfter;
  return next;
}

export { brands, countries, regions };

/** Canonical Screener URL builder — always emits snake_case query keys. */
export function buildScreenerHref(partial: Partial<ScreenerFilters> = {}): string {
  const params = filtersToParams({
    sort: 'latest_price_desc',
    page: 1,
    ...partial,
  });
  const qs = params.toString();
  return qs ? `/screener?${qs}` : '/screener';
}
