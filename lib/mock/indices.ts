import type { MarketIndex } from './types';
import { marketIndices as baseIndices } from './bottles';

export type IndexProfile = MarketIndex & {
  category: 'Broad' | 'Region' | 'Country' | 'Style';
  asOf: string;
  currency: 'GBP';
  methodologyStatus: 'planned' | 'illustrative';
  constituents: string;
  construction: string;
  limitations: string[];
};

const DETAIL: Record<
  string,
  Omit<IndexProfile, keyof MarketIndex>
> = {
  'wi-broad': {
    category: 'Broad',
    asOf: '2026-03-01',
    currency: 'GBP',
    methodologyStatus: 'illustrative',
    constituents: 'Frequently traded bottles across Scotch, Japanese, and world whisky with lot history.',
    construction:
      'Illustrative volume-weighted basket for product layout. Production indices will publish explicit inclusion rules, caps, and rebalance cadence.',
    limitations: [
      'Not a live production print',
      'Weights are demo heuristics, not disclosed production methodology',
      'Thin months are not interpolated into continuous prices',
    ],
  },
  'wi-scotch': {
    category: 'Region',
    asOf: '2026-03-01',
    currency: 'GBP',
    methodologyStatus: 'illustrative',
    constituents: 'Scottish single malt and related Scotch expressions with observed auction frequency.',
    construction:
      'Segment placeholder spanning Speyside, Islay, Highlands, and Campbeltown liquidity. Not a simple average of all Scotch lots.',
    limitations: [
      'Regional mixes shift with catalogue composition',
      'Independent bottlers may be under- or over-represented in the demo set',
    ],
  },
  'wi-japan': {
    category: 'Country',
    asOf: '2026-03-01',
    currency: 'GBP',
    methodologyStatus: 'illustrative',
    constituents: 'Japanese flagships and closed-distillery icons with secondary-market history.',
    construction:
      'Country segment placeholder. Production construction will address FX, thin trophy lots, and label variants.',
    limitations: [
      'Higher dispersion than Scotch core lines',
      'Single trophy lots can distort short windows without caps',
    ],
  },
  'wi-rare': {
    category: 'Style',
    asOf: '2026-03-01',
    currency: 'GBP',
    methodologyStatus: 'illustrative',
    constituents: 'Low-liquidity trophies and scarce releases with capped constituent weights.',
    construction:
      'Illustrative rare basket showing how WhiskyIndex intends to avoid single-lot dominance when methodology ships.',
    limitations: [
      'Sparse observations — treat path as layout only',
      'Liquidity class filters are not yet production-grade',
    ],
  },
};

export const indexProfiles: IndexProfile[] = baseIndices.map((idx) => ({
  ...idx,
  ...(DETAIL[idx.slug] ?? {
    category: 'Broad' as const,
    asOf: '2026-03-01',
    currency: 'GBP' as const,
    methodologyStatus: 'planned' as const,
    constituents: idx.description,
    construction: 'Methodology pending.',
    limitations: ['Illustrative placeholder only'],
  }),
}));

export function getIndexProfile(slug: string) {
  return indexProfiles.find((i) => i.slug === slug);
}

/** Seeded monthly path ending at the index’s illustrative level. */
export function indexHistory(slug: string, months = 24) {
  const idx = getIndexProfile(slug);
  const end = idx?.value ?? 200;
  let seed = 0;
  for (let i = 0; i < slug.length; i++) seed += slug.charCodeAt(i);
  const points: { date: string; value: number }[] = [];
  let v = end * (0.88 + (seed % 7) * 0.01);
  for (let i = months; i >= 0; i--) {
    const d = new Date('2026-03-01T12:00:00Z');
    d.setMonth(d.getMonth() - i);
    const wobble =
      Math.sin((i + seed) * 0.45) * 0.014 + Math.cos((i + seed * 0.3) * 0.22) * 0.007;
    v = v * (1 + wobble) + (end - v) * 0.07;
    if (i === 0) v = end;
    points.push({ date: d.toISOString().slice(0, 10), value: Math.round(v * 10) / 10 });
  }
  return points;
}

export const plannedIndexNames = [
  'WhiskyIndex 100',
  'Speyside',
  'Islay',
  'Macallan basket',
  'Independent bottlers',
];
