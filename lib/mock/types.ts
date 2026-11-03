export type PricePoint = {
  date: string;
  price: number;
};

export type Bottle = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  distillery: string;
  region: string;
  country: string;
  ageYears: number | null;
  abv: number;
  volumeMl: number;
  releaseYear: number | null;
  caskType: string;
  bottleCount: number | null;
  latestPrice: number;
  currency: 'GBP';
  change1d: number;
  change1m: number;
  change1y: number;
  change3y: number;
  volume30d: number;
  liquidity: 'High' | 'Medium' | 'Low';
  sparkline: number[];
  history: PricePoint[];
  lastAuction: string;
  lotCount: number;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  href: string;
  count: number;
  change1m: number;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readMinutes: number;
  body: string[];
};

export type PortfolioHolding = {
  bottleId: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
};

export type MarketIndex = {
  name: string;
  value: number;
  change1d: number;
  change1m: number;
};
