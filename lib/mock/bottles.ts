import type { Bottle, Collection, MarketIndex } from './types';

function hist(seed: number, latest: number, months = 24): { history: { date: string; price: number }[]; sparkline: number[] } {
  const history: { date: string; price: number }[] = [];
  let price = latest * 0.72;
  for (let i = months; i >= 0; i--) {
    const d = new Date('2026-03-01');
    d.setMonth(d.getMonth() - i);
    const wobble = Math.sin((seed + i) * 0.7) * 0.035 + Math.cos((seed + i) * 0.25) * 0.02;
    price = price * (1 + wobble) + (latest - price) * (0.04 + (months - i) * 0.0015);
    history.push({
      date: d.toISOString().slice(0, 10),
      price: Math.round(price * 100) / 100,
    });
  }
  history[history.length - 1].price = latest;
  const sparkline = history.slice(-12).map((h) => h.price);
  return { history, sparkline };
}

const raw: Omit<Bottle, 'history' | 'sparkline'>[] = [
  {
    id: 'b1',
    slug: 'macallan-18-year-old-sherry-oak-1996',
    name: 'The Macallan 18 Year Old Sherry Oak 1996',
    brand: 'Macallan',
    distillery: 'Macallan',
    region: 'Speyside',
    country: 'Scotland',
    ageYears: 18,
    abv: 43,
    volumeMl: 700,
    releaseYear: 2014,
    vintageYear: 1996,
    bottlingYear: 2014,
    edition: 'Sherry Oak',
    bottler: 'The Macallan Distillers',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Sherry oak',
    caskNumber: null,
    bottleCount: null,
    description:
      'Official 18-year-old Sherry Oak release distilled in 1996 and bottled in 2014. Distinct from later continuum bottlings by vintage year.',
    latestPrice: 505,
    currency: 'GBP',
    change1d: 1.2,
    change1m: 3.4,
    change1y: -2.1,
    change3y: 18.6,
    volume30d: 42,
    liquidity: 'High',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 186,
  },
  {
    id: 'b2',
    slug: 'springbank-15',
    name: 'Springbank 15 Year Old',
    brand: 'Springbank',
    distillery: 'Springbank',
    region: 'Campbeltown',
    country: 'Scotland',
    ageYears: 15,
    abv: 46,
    volumeMl: 700,
    releaseYear: 2023,
    vintageYear: null,
    bottlingYear: 2023,
    edition: null,
    bottler: 'J. & A. Mitchell & Co.',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Ex-bourbon & sherry',
    caskNumber: null,
    bottleCount: null,
    description:
      'Core-range Campbeltown 15-year-old from Springbank, matured in a mix of ex-bourbon and sherry casks.',
    latestPrice: 188,
    currency: 'GBP',
    change1d: -0.8,
    change1m: 1.1,
    change1y: 12.4,
    change3y: 41.2,
    volume30d: 67,
    liquidity: 'High',
    lastAuction: 'Scotch Whisky Auctions',
    lotCount: 240,
  },
  {
    id: 'b3',
    slug: 'yamazaki-12',
    name: 'Yamazaki 12 Year Old',
    brand: 'Yamazaki',
    distillery: 'Yamazaki',
    region: 'Japan',
    country: 'Japan',
    ageYears: 12,
    abv: 43,
    volumeMl: 700,
    releaseYear: 2021,
    vintageYear: null,
    bottlingYear: 2021,
    edition: null,
    bottler: 'Suntory',
    whiskyType: 'Japanese Single Malt Whisky',
    officialBottling: true,
    caskType: 'Mizunara & sherry',
    caskNumber: null,
    bottleCount: null,
    description:
      'Flagship aged Yamazaki single malt; auction marks vary with label and packaging condition.',
    latestPrice: 162,
    currency: 'GBP',
    change1d: 0.4,
    change1m: -1.6,
    change1y: -8.3,
    change3y: -22.1,
    volume30d: 91,
    liquidity: 'High',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 312,
  },
  {
    id: 'b4',
    slug: 'macallan-rare-cask',
    name: 'Macallan Rare Cask',
    brand: 'Macallan',
    distillery: 'Macallan',
    region: 'Speyside',
    country: 'Scotland',
    ageYears: null,
    abv: 43,
    volumeMl: 700,
    releaseYear: 2020,
    vintageYear: null,
    bottlingYear: 2020,
    edition: 'Rare Cask',
    bottler: 'The Macallan Distillers',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Sherry seasoned oak',
    caskNumber: null,
    bottleCount: null,
    description:
      'No-age-statement Macallan release drawn from sherry-seasoned oak casks. Batch variation means comps should stay within the same release window.',
    latestPrice: 285,
    currency: 'GBP',
    change1d: -1.4,
    change1m: -4.2,
    change1y: -11.0,
    change3y: 6.8,
    volume30d: 28,
    liquidity: 'Medium',
    lastAuction: 'Just Whisky',
    lotCount: 94,
  },
  {
    id: 'b5',
    slug: 'hibiki-21',
    name: 'Hibiki 21 Year Old',
    brand: 'Hibiki',
    distillery: 'Suntory',
    region: 'Japan',
    country: 'Japan',
    ageYears: 21,
    abv: 43,
    volumeMl: 700,
    releaseYear: 2018,
    vintageYear: null,
    bottlingYear: 2018,
    edition: null,
    bottler: 'Suntory',
    whiskyType: 'Japanese Blended Whisky',
    officialBottling: true,
    caskType: 'Blended malt & grain',
    caskNumber: null,
    bottleCount: null,
    description:
      'Discontinued Suntory blend; secondary-market appearances are infrequent relative to core Japanese malt.',
    latestPrice: 980,
    currency: 'GBP',
    change1d: 2.1,
    change1m: 5.8,
    change1y: 14.2,
    change3y: 52.0,
    volume30d: 11,
    liquidity: 'Low',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 58,
  },
  {
    id: 'b6',
    slug: 'ardbeg-uigeadail',
    name: 'Ardbeg Uigeadail',
    brand: 'Ardbeg',
    distillery: 'Ardbeg',
    region: 'Islay',
    country: 'Scotland',
    ageYears: null,
    abv: 54.2,
    volumeMl: 700,
    releaseYear: 2024,
    vintageYear: null,
    bottlingYear: 2024,
    edition: 'Uigeadail',
    bottler: 'Ardbeg Distillery',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Sherry & bourbon',
    caskNumber: null,
    bottleCount: null,
    description:
      'Core-range cask-strength Islay malt; high auction frequency supports tight observed marks.',
    latestPrice: 78,
    currency: 'GBP',
    change1d: 0.2,
    change1m: 0.9,
    change1y: 3.1,
    change3y: 9.4,
    volume30d: 120,
    liquidity: 'High',
    lastAuction: 'Scotch Whisky Auctions',
    lotCount: 401,
  },
  {
    id: 'b7',
    slug: 'karuizawa-1984',
    name: 'Karuizawa 1984 Cask #3623',
    brand: 'Karuizawa',
    distillery: 'Karuizawa',
    region: 'Japan',
    country: 'Japan',
    ageYears: 30,
    abv: 60.8,
    volumeMl: 700,
    releaseYear: 2014,
    vintageYear: 1984,
    bottlingYear: 2014,
    edition: 'Cask #3623',
    bottler: 'Number One Drinks Co.',
    whiskyType: 'Japanese Single Malt Whisky',
    officialBottling: false,
    caskType: 'Sherry butt',
    caskNumber: '3623',
    bottleCount: 312,
    description:
      'Closed-distillery Karuizawa single-cask bottling. Each cask number is a separate canonical bottle.',
    latestPrice: 12400,
    currency: 'GBP',
    change1d: -0.3,
    change1m: 1.9,
    change1y: 8.7,
    change3y: 27.4,
    volume30d: 2,
    liquidity: 'Low',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 17,
  },
  {
    id: 'b8',
    slug: 'port-ellen-9th-release',
    name: 'Port Ellen 9th Release 30 Year Old',
    brand: 'Port Ellen',
    distillery: 'Port Ellen',
    region: 'Islay',
    country: 'Scotland',
    ageYears: 30,
    abv: 57.7,
    volumeMl: 700,
    releaseYear: 2009,
    vintageYear: 1979,
    bottlingYear: 2009,
    edition: '9th Release',
    bottler: 'Diageo Special Releases',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Refill American oak',
    caskNumber: null,
    bottleCount: 5916,
    description:
      'Diageo Special Releases annual Port Ellen bottling — kept separate from other annual releases.',
    latestPrice: 2650,
    currency: 'GBP',
    change1d: 0.7,
    change1m: 2.4,
    change1y: 6.1,
    change3y: 19.8,
    volume30d: 5,
    liquidity: 'Low',
    lastAuction: 'Just Whisky',
    lotCount: 33,
  },
  {
    id: 'b9',
    slug: 'glenfarclas-25',
    name: 'Glenfarclas 25 Year Old',
    brand: 'Glenfarclas',
    distillery: 'Glenfarclas',
    region: 'Speyside',
    country: 'Scotland',
    ageYears: 25,
    abv: 43,
    volumeMl: 700,
    releaseYear: 2022,
    vintageYear: null,
    bottlingYear: 2022,
    edition: null,
    bottler: 'J. & G. Grant',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Sherry casks',
    caskNumber: null,
    bottleCount: null,
    description: 'Family-owned Speyside 25-year-old matured in sherry casks.',
    latestPrice: 210,
    currency: 'GBP',
    change1d: -0.5,
    change1m: -1.2,
    change1y: 2.8,
    change3y: 15.1,
    volume30d: 34,
    liquidity: 'Medium',
    lastAuction: 'Scotch Whisky Auctions',
    lotCount: 122,
  },
  {
    id: 'b10',
    slug: 'lagavulin-16',
    name: 'Lagavulin 16 Year Old',
    brand: 'Lagavulin',
    distillery: 'Lagavulin',
    region: 'Islay',
    country: 'Scotland',
    ageYears: 16,
    abv: 43,
    volumeMl: 700,
    releaseYear: 2024,
    vintageYear: null,
    bottlingYear: 2024,
    edition: null,
    bottler: 'Diageo',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Ex-bourbon & European oak',
    caskNumber: null,
    bottleCount: null,
    description: 'Core Islay 16-year-old with deep auction history and high trading frequency.',
    latestPrice: 92,
    currency: 'GBP',
    change1d: 0.1,
    change1m: 0.4,
    change1y: 1.9,
    change3y: 7.2,
    volume30d: 155,
    liquidity: 'High',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 520,
  },
  {
    id: 'b11',
    slug: 'balvenie-30',
    name: 'Balvenie 30 Year Old',
    brand: 'Balvenie',
    distillery: 'Balvenie',
    region: 'Speyside',
    country: 'Scotland',
    ageYears: 30,
    abv: 47.3,
    volumeMl: 700,
    releaseYear: 2019,
    vintageYear: null,
    bottlingYear: 2019,
    edition: null,
    bottler: 'William Grant & Sons',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'European oak sherry',
    caskNumber: null,
    bottleCount: null,
    description: 'Aged Speyside official bottling finished in European oak sherry casks.',
    latestPrice: 1180,
    currency: 'GBP',
    change1d: 1.5,
    change1m: 4.1,
    change1y: 9.6,
    change3y: 28.3,
    volume30d: 8,
    liquidity: 'Medium',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 41,
  },
  {
    id: 'b12',
    slug: 'bowmore-black-bowmore',
    name: 'Black Bowmore 1964 Final Edition',
    brand: 'Bowmore',
    distillery: 'Bowmore',
    region: 'Islay',
    country: 'Scotland',
    ageYears: 42,
    abv: 40.6,
    volumeMl: 700,
    releaseYear: 2007,
    vintageYear: 1964,
    bottlingYear: 2007,
    edition: 'Final Edition',
    bottler: 'Bowmore Distillery',
    whiskyType: 'Single Malt Scotch Whisky',
    officialBottling: true,
    caskType: 'Sherry butts',
    caskNumber: null,
    bottleCount: 831,
    description:
      'Final Edition of the Black Bowmore series from 1964 distillate. Kept separate from earlier Black Bowmore releases.',
    latestPrice: 18500,
    currency: 'GBP',
    change1d: 0.9,
    change1m: 3.2,
    change1y: 11.4,
    change3y: 38.7,
    volume30d: 1,
    liquidity: 'Low',
    lastAuction: 'Whisky Auctioneer',
    lotCount: 9,
  },
];

export const bottles: Bottle[] = raw.map((b, i) => {
  const { history, sparkline } = hist(i + 3, b.latestPrice);
  return { ...b, history, sparkline };
});

export const collections: Collection[] = [
  {
    id: 'c1',
    name: 'Japanese Icons',
    description: 'Closed distilleries & flagship aged stock',
    href: '/screener?country=Japan',
    count: 48,
    change1m: 2.8,
  },
  {
    id: 'c2',
    name: 'Islay Core',
    description: 'Peated benchmarks with deep auction history',
    href: '/screener?region=Islay',
    count: 76,
    change1m: 1.1,
  },
  {
    id: 'c3',
    name: 'Macallan Watchlist',
    description: 'Sherry oak, rare cask & limited releases',
    href: '/screener?brand=Macallan', // brand= supported by Screener parser
    count: 112,
    change1m: -1.9,
  },
  {
    id: 'c4',
    name: 'Campbeltown Tight Supply',
    description: 'Springbank family bottles with constrained release',
    href: '/screener?region=Campbeltown',
    count: 29,
    change1m: 4.6,
  },
];

export const marketIndices: MarketIndex[] = [
  {
    slug: 'wi-broad',
    name: 'WI Broad',
    value: 214.6,
    change1d: 0.32,
    change1m: 1.4,
    change1y: 6.8,
    description: 'Volume-weighted basket of frequently traded bottles across regions.',
  },
  {
    slug: 'wi-scotch',
    name: 'WI Scotch',
    value: 198.2,
    change1d: 0.18,
    change1m: 0.9,
    change1y: 4.2,
    description: 'Scottish whisky continuum — Speyside, Islay, Campbeltown, Highlands.',
  },
  {
    slug: 'wi-japan',
    name: 'WI Japan',
    value: 276.4,
    change1d: -0.41,
    change1m: -1.2,
    change1y: -9.4,
    description: 'Japanese flagships and closed-distillery icons with auction history.',
  },
  {
    slug: 'wi-rare',
    name: 'WI Rare',
    value: 341.8,
    change1d: 0.77,
    change1m: 3.1,
    change1y: 14.6,
    description: 'Low-liquidity trophies — capped weights so single lots cannot dominate.',
  },
];

export function getIndexBySlug(slug: string) {
  return marketIndices.find((i) => i.slug === slug);
}

export function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function distilleries() {
  const map = new Map<string, { name: string; region: string; country: string; count: number }>();
  for (const b of bottles) {
    const key = b.distillery;
    const prev = map.get(key);
    if (prev) prev.count += 1;
    else map.set(key, { name: b.distillery, region: b.region, country: b.country, count: 1 });
  }
  return Array.from(map.values())
    .map((d) => ({
      ...d,
      slug: slugifyName(d.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDistilleryBySlug(slug: string) {
  return distilleries().find((d) => d.slug === slug);
}

export function bottlesForDistillery(slug: string) {
  const d = getDistilleryBySlug(slug);
  if (!d) return [];
  return bottles.filter((b) => b.distillery === d.name);
}

export function getBottleBySlug(slug: string) {
  // Stable aliases for renamed Macallan 18 slug
  if (slug === 'macallan-18-sherry-oak') {
    return bottles.find((b) => b.id === 'b1');
  }
  return bottles.find((b) => b.slug === slug || b.id === slug);
}

export function searchBottles(opts: {
  q?: string;
  brand?: string;
  region?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  let rows = [...bottles];
  const q = opts.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q)
    );
  }
  if (opts.brand) rows = rows.filter((b) => b.brand === opts.brand);
  if (opts.region) rows = rows.filter((b) => b.region === opts.region);
  if (opts.country) rows = rows.filter((b) => b.country === opts.country);
  if (opts.minPrice != null) rows = rows.filter((b) => b.latestPrice >= opts.minPrice!);
  if (opts.maxPrice != null) rows = rows.filter((b) => b.latestPrice <= opts.maxPrice!);

  switch (opts.sort) {
    case 'latest_price_asc':
      rows.sort((a, b) => a.latestPrice - b.latestPrice);
      break;
    case 'name_asc':
      rows.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'change1m_desc':
      rows.sort((a, b) => b.change1m - a.change1m);
      break;
    case 'change1m_asc':
      rows.sort((a, b) => a.change1m - b.change1m);
      break;
    default:
      rows.sort((a, b) => b.latestPrice - a.latestPrice);
  }
  return rows;
}

export function topMovers(limit = 5) {
  const gainers = [...bottles].sort((a, b) => b.change1m - a.change1m).slice(0, limit);
  const losers = [...bottles].sort((a, b) => a.change1m - b.change1m).slice(0, limit);
  return { gainers, losers };
}

export function brands() {
  return Array.from(new Set(bottles.map((b) => b.brand))).sort();
}

export function regions() {
  return Array.from(new Set(bottles.map((b) => b.region))).sort();
}

export function countries() {
  return Array.from(new Set(bottles.map((b) => b.country))).sort();
}

/** Soft illustrative bottle silhouette tones — not product photography */
export function bottleVisualTone(bottle: Bottle): 'amber' | 'peat' | 'oak' | 'slate' {
  if (bottle.region === 'Islay' || bottle.region === 'Campbeltown') return 'peat';
  if (bottle.country === 'Japan') return 'slate';
  if ((bottle.latestPrice ?? 0) >= 2000) return 'oak';
  return 'amber';
}
