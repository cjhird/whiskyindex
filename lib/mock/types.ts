export type PricePoint = {
  date: string;
  price: number;
};

export type LiquidityTier = 'High' | 'Medium' | 'Low';

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
  /** Distillation / vintage year when distinct from bottling */
  vintageYear: number | null;
  bottlingYear: number | null;
  edition: string | null;
  bottler: string;
  whiskyType: string;
  officialBottling: boolean;
  caskType: string;
  caskNumber: string | null;
  bottleCount: number | null;
  /** Short factual release note — omit rather than invent */
  description: string | null;
  latestPrice: number;
  currency: 'GBP';
  change1d: number;
  change1m: number;
  change1y: number;
  change3y: number;
  volume30d: number;
  liquidity: LiquidityTier;
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

export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export type ArticleCover = 'slate' | 'oak' | 'peat' | 'amber';

export type Author = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
};

/** Structured article body — CMS-style blocks rendered by the article template */
export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; id: string; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'divider' }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | {
      type: 'stats';
      period: string;
      source: string;
      items: Array<{ label: string; value: string; note?: string }>;
    }
  | { type: 'bottleRef'; bottleSlug: string }
  | { type: 'marketCta'; label: string; href: string; description?: string }
  | {
      type: 'chartSnapshot';
      title: string;
      period: string;
      source: string;
      points: Array<{ label: string; value: number }>;
    }
  | { type: 'footnotes'; items: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  updatedAt: string | null;
  readMinutes: number;
  /** Soft illustrative cover tone — not a stock photo */
  cover: ArticleCover;
  coverAlt: string;
  coverCaption: string | null;
  authorId: string;
  status: ArticleStatus;
  /** Explicit CMS featured flags — not auto “latest” */
  featuredRank: number | null;
  topics: string[];
  relatedDistilleries: string[];
  relatedBottles: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  /** For Market Report articles */
  reportingPeriod: string | null;
  sources: string[];
  blocks: ArticleBlock[];
  /** Plain paragraphs for lightweight consumers (home cards, etc.) */
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
