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

export type ArticleCategory = 'News' | 'Guide' | 'Analysis' | 'Market Report';

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readMinutes: number;
  body: string[];
  /** Soft illustrative cover tone — not a stock photo */
  cover: 'slate' | 'oak' | 'peat' | 'amber';
};

export type PortfolioHolding = {
  bottleId: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
};

export type MarketIndex = {
  slug: string;
  name: string;
  value: number;
  change1d: number;
  change1m: number;
  change1y: number;
  description: string;
};

export type Distillery = {
  slug: string;
  name: string;
  region: string;
  country: string;
  founded: number | null;
  status: 'Operating' | 'Closed' | 'Mothballed';
  summary: string;
};

export type WatchlistItem = {
  bottleId: string;
  addedAt: string;
  note?: string;
};
