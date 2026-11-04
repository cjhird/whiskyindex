import type { Article, ArticleBlock, ArticleCategory, Author } from './types';

export const RESERVED_INSIGHT_SLUGS = ['news', 'guides', 'analysis', 'reports'] as const;

export type CategoryRoute = (typeof RESERVED_INSIGHT_SLUGS)[number];

export const CATEGORY_META: Record<
  ArticleCategory,
  { route: CategoryRoute; label: string; plural: string; description: string }
> = {
  News: {
    route: 'news',
    label: 'News',
    plural: 'News',
    description:
      'Industry developments, auction-house announcements, and notable secondary-market results.',
  },
  Guide: {
    route: 'guides',
    label: 'Guide',
    plural: 'Guides',
    description:
      'Educational explainers on auction prices, valuations, liquidity, fees, and collecting.',
  },
  Analysis: {
    route: 'analysis',
    label: 'Analysis',
    plural: 'Analysis',
    description:
      'Data-driven research on trends, distilleries, regions, and specific releases.',
  },
  'Market Report': {
    route: 'reports',
    label: 'Market Report',
    plural: 'Market Reports',
    description:
      'Periodic reviews of auction activity, price movements, and market performance.',
  },
};

export const TOPIC_OPTIONS = [
  'Macallan',
  'Japanese Whisky',
  'Auction Prices',
  'Market Trends',
  'Whisky Investing',
  'Valuations',
  'Collecting',
  'Liquidity',
  'Campbeltown',
  'Islay',
  'Buyer Premiums',
  'Indexes',
] as const;

export const authors: Author[] = [
  {
    id: 'a1',
    slug: 'elena-muir',
    name: 'Elena Muir',
    role: 'Market editor',
    bio: 'Covers secondary-market auction activity and whisky investment research for WhiskyIndex.',
  },
  {
    id: 'a2',
    slug: 'james-calder',
    name: 'James Calder',
    role: 'Research analyst',
    bio: 'Focuses on index construction, liquidity measurement, and bottle-level auction comps.',
  },
  {
    id: 'a3',
    slug: 'sofia-nakamura',
    name: 'Sofia Nakamura',
    role: 'Correspondent',
    bio: 'Writes on Japanese whisky, closed distilleries, and collector market structure.',
  },
];

function paras(...texts: string[]): ArticleBlock[] {
  return texts.map((text) => ({ type: 'p' as const, text }));
}

function bodyFromBlocks(blocks: ArticleBlock[]): string[] {
  return blocks.filter((b): b is Extract<ArticleBlock, { type: 'p' }> => b.type === 'p').map((b) => b.text);
}

type ArticleInput = Omit<Article, 'body'> & { blocks: ArticleBlock[] };

const raw: ArticleInput[] = [
  {
    slug: 'february-2026-whisky-market-report',
    title: 'February 2026 whisky market report',
    excerpt:
      'Auction clearances held firm through February closes. Islay benchmarks bid tight while aged Japanese icons remain selective.',
    category: 'Market Report',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-02',
    readMinutes: 9,
    cover: 'slate',
    coverAlt: 'Abstract slate gradient representing market report cover',
    coverCaption: 'Illustrative cover — reporting period February 2026',
    authorId: 'a1',
    status: 'published',
    featuredRank: 1,
    topics: ['Market Trends', 'Auction Prices', 'Liquidity'],
    relatedDistilleries: ['macallan', 'springbank'],
    relatedBottles: ['macallan-18-year-old-sherry-oak-1996', 'springbank-15'],
    seoTitle: 'February 2026 Whisky Market Report · WhiskyIndex',
    seoDescription:
      'Monthly review of secondary whisky auction turnover, bottle sales, and regional trends for February 2026.',
    reportingPeriod: 'February 2026',
    sources: [
      'Closed lots from covered UK auction houses (illustrative demo dataset)',
      'WhiskyIndex methodology: buyer-inclusive totals converted to GBP',
    ],
    blocks: [
      {
        type: 'stats',
        period: 'February 2026 (illustrative snapshot)',
        source: 'WhiskyIndex demo market close · refreshed 1 Mar 2026',
        items: [
          { label: 'Auction turnover', value: '£18.4m', note: '+4.2% vs Jan' },
          { label: 'Bottles sold', value: '24,680', note: '+2.8% vs Jan' },
          { label: 'Unique bottles', value: '6,140', note: '+1.6% vs Jan' },
          { label: 'Active distilleries', value: '186', note: 'Stable' },
        ],
      },
      ...paras(
        'Hammer prices across major UK auction houses finished February within a narrow band of January prints. Volume was healthier in Campbeltown and Islay core expressions, while trophy Japanese lots needed sharper reserves to clear.',
        'Macallan sherry oak continuum bottles saw modest month-on-month gains, helped by predictable release cadence and deep buyer pools. Rare Cask continued to lag, with wider spreads on mid-condition bottles.'
      ),
      { type: 'h2', id: 'regional-signals', text: 'Regional signals' },
      {
        type: 'table',
        caption: 'Illustrative regional activity — February 2026 reporting window',
        headers: ['Region', 'Bottles sold', 'Avg lot (GBP)', 'Notes'],
        rows: [
          ['Islay', '4,120', '£186', 'Core expressions tight'],
          ['Speyside', '6,840', '£242', 'Macallan continuum firm'],
          ['Campbeltown', '1,090', '£214', 'Supply still constrained'],
          ['Japan', '980', '£1,120', 'Selective bidding'],
        ],
      },
      {
        type: 'chartSnapshot',
        title: 'Monthly auction turnover (GBP)',
        period: 'Sep 2025 – Feb 2026 (fixed snapshot)',
        source: 'Illustrative WhiskyIndex demo series',
        points: [
          { label: 'Sep', value: 15.2 },
          { label: 'Oct', value: 16.1 },
          { label: 'Nov', value: 17.4 },
          { label: 'Dec', value: 19.8 },
          { label: 'Jan', value: 17.6 },
          { label: 'Feb', value: 18.4 },
        ],
      },
      { type: 'h2', id: 'portfolio-implications', text: 'Portfolio implications' },
      ...paras(
        'For collectors running model portfolios, the signal is rotation rather than risk-off: liquidity is concentrating in bottles with frequent auction comps and transparent packing notes.',
        'Low-liquidity trophies remain bid-driven. Marks based on isolated lots should not be treated as continuous market prices.'
      ),
      {
        type: 'bottleRef',
        bottleSlug: 'macallan-18-year-old-sherry-oak-1996',
      },
      {
        type: 'marketCta',
        label: 'Explore February market data',
        href: '/market',
        description: 'Open the market dashboard for turnover, volume, and segment activity.',
      },
      {
        type: 'callout',
        title: 'Investment information',
        text: 'Auction results are historical market evidence. They are not guaranteed resale values or forecasts of investment returns.',
      },
      {
        type: 'footnotes',
        items: [
          'All figures in this report are illustrative placeholders for product design.',
          'Buyer-inclusive totals used where available; original currencies normalised to GBP for aggregation.',
        ],
      },
    ],
  },
  {
    slug: 'macallan-market-performance-2026',
    title: 'How has the Macallan auction market performed in 2026?',
    excerpt:
      'An examination of historical auction prices, trading activity and market trends across collectible Macallan releases.',
    category: 'Analysis',
    publishedAt: '2026-02-24',
    updatedAt: null,
    readMinutes: 11,
    cover: 'oak',
    coverAlt: 'Warm oak gradient cover for Macallan analysis',
    coverCaption: null,
    authorId: 'a2',
    status: 'published',
    featuredRank: 2,
    topics: ['Macallan', 'Market Trends', 'Auction Prices', 'Liquidity'],
    relatedDistilleries: ['macallan'],
    relatedBottles: ['macallan-18-year-old-sherry-oak-1996', 'macallan-rare-cask'],
    seoTitle: 'Macallan Auction Market Performance 2026',
    seoDescription:
      'Analysis of Macallan secondary-market auction prices, trading frequency, and release-level comps in early 2026.',
    reportingPeriod: null,
    sources: [
      'Matched single-bottle Macallan lots in the WhiskyIndex demo history',
      '/methodology — median windows and currency conversion',
    ],
    blocks: [
      ...paras(
        'Macallan remains one of the deepest auction segments on the secondary market. Depth does not mean uniformity: continuum sherry oak releases trade frequently, while limited and no-age-statement lines can show wider dispersion between lots.'
      ),
      { type: 'h2', id: 'what-the-comps-show', text: 'What the comps show' },
      {
        type: 'stats',
        period: 'Trailing 12 months to 1 Mar 2026 (illustrative)',
        source: 'Demo bottle profiles — not live prints',
        items: [
          { label: 'Sherry Oak 1996 latest', value: '£505' },
          { label: 'Rare Cask latest', value: '£285' },
          { label: 'Sherry Oak 12M change', value: 'Conditional', note: 'Shown only with sufficient sample' },
        ],
      },
      {
        type: 'table',
        caption: 'Selected Macallan releases — latest observed auction totals',
        headers: ['Release', 'Latest (GBP)', 'Liquidity', '12M sales (demo)'],
        rows: [
          ['18YO Sherry Oak 1996', '£505', 'High', 'Frequent'],
          ['Rare Cask', '£285', 'Medium', 'Regular'],
        ],
      },
      { type: 'h2', id: 'reading-dispersion', text: 'Reading dispersion' },
      ...paras(
        'Condition, packaging, and bottling year still drive lot-to-lot differences. Comparing a boxed 1996 vintage bottle to a later continuum print without normalisation will distort performance.',
        'Where sales are infrequent, median-based 12-month change should be withheld rather than inferred from a single clearing price.'
      ),
      {
        type: 'bottleRef',
        bottleSlug: 'macallan-18-year-old-sherry-oak-1996',
      },
      {
        type: 'bottleRef',
        bottleSlug: 'macallan-rare-cask',
      },
      {
        type: 'marketCta',
        label: 'Explore Macallan market data',
        href: '/distilleries/macallan',
        description: 'Open the Macallan distillery profile and linked bottle marks.',
      },
      {
        type: 'marketCta',
        label: 'Compare releases in Screener',
        href: '/screener?distillery=Macallan',
        description: 'Filter the research tool to Macallan bottles.',
      },
      {
        type: 'quote',
        text: 'Liquidity is a property of how often a bottle clears at auction — not a synonym for quality or rarity.',
        cite: 'WhiskyIndex methodology note',
      },
      {
        type: 'callout',
        title: 'Observation vs opinion',
        text: 'Figures above summarise historical demo auction evidence. They are not predictions about future Macallan prices.',
      },
    ],
  },
  {
    slug: 'how-we-build-bottle-indexes',
    title: 'How WhiskyIndex constructs bottle and segment indexes',
    excerpt:
      'A plain-English walkthrough of observation windows, currency normalisation, and why we cap single-bottle weights.',
    category: 'Analysis',
    publishedAt: '2026-02-18',
    updatedAt: null,
    readMinutes: 8,
    cover: 'oak',
    coverAlt: 'Oak-toned cover for index methodology analysis',
    coverCaption: null,
    authorId: 'a2',
    status: 'published',
    featuredRank: 3,
    topics: ['Indexes', 'Valuations', 'Market Trends'],
    relatedDistilleries: [],
    relatedBottles: [],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: null,
    sources: ['/methodology', '/insights/reading-auction-premiums'],
    blocks: [
      { type: 'h2', id: 'observation-windows', text: 'Observation windows' },
      ...paras(
        'Each index observation window is a calendar month of closed auctions. Prices are converted to GBP before aggregation, then filtered for incomplete lots and withdrawn sales.'
      ),
      { type: 'h2', id: 'weight-caps', text: 'Weight caps' },
      ...paras(
        'Bottle-level returns are volume-weighted within the segment, with a hard cap so a single ultra-rare lot cannot dominate the WI Rare series.',
        'Missing months for thinly traded bottles are carried with linear interpolation for index construction only — never for the bottle detail latest price.'
      ),
      {
        type: 'marketCta',
        label: 'Planned market indices',
        href: '/market/indices',
        description: 'Segment benchmarks remain methodology-pending until live coverage ships.',
      },
      {
        type: 'callout',
        title: 'Transparency',
        text: 'Until a defensible live index ships, the market dashboard emphasises trading activity rather than a fabricated headline index.',
      },
    ],
  },
  {
    slug: 'understanding-whisky-auction-prices',
    title: 'Understanding whisky auction prices',
    excerpt:
      'How hammer prices, buyer premiums, and condition notes combine into the marks collectors actually use.',
    category: 'Guide',
    publishedAt: '2026-02-12',
    updatedAt: null,
    readMinutes: 7,
    cover: 'amber',
    coverAlt: 'Amber gradient cover for auction pricing guide',
    coverCaption: null,
    authorId: 'a1',
    status: 'published',
    featuredRank: null,
    topics: ['Auction Prices', 'Whisky Investing', 'Valuations', 'Buyer Premiums'],
    relatedDistilleries: [],
    relatedBottles: ['lagavulin-16', 'ardbeg-uigeadail'],
    seoTitle: 'Understanding Whisky Auction Prices',
    seoDescription:
      'Guide to reading hammer prices, buyer premiums, and auction condition notes for collectible whisky.',
    reportingPeriod: null,
    sources: ['/methodology', '/data-sources'],
    blocks: [
      ...paras(
        'Auction prices are observations of completed sales, not continuous quotes. A bottle with no recent lot does not have a silently updating “market price”.'
      ),
      { type: 'h2', id: 'hammer-vs-total', text: 'Hammer versus buyer total' },
      ...paras(
        'Most houses quote hammer separately from buyer premium. WhiskyIndex stores both and surfaces total price as the primary series so performance charts match what a winning bidder settled.'
      ),
      { type: 'h2', id: 'condition', text: 'Condition and packaging' },
      {
        type: 'ul',
        items: [
          'Box and papers can move clearing prices on mid-value bottles',
          'Fill level matters more as bottles age and become scarcer',
          'Always preserve original lot notes when comparing comps',
        ],
      },
      {
        type: 'ol',
        items: [
          'Identify the canonical release (vintage, edition, size)',
          'Collect recent single-bottle comps only',
          'Prefer medians over single outliers when sample size allows',
        ],
      },
      {
        type: 'marketCta',
        label: 'Browse bottles in Screener',
        href: '/screener',
        description: 'Filter by distillery, age, and auction activity.',
      },
    ],
  },
  {
    slug: 'reading-auction-premiums',
    title: 'Reading buyer premiums without fooling yourself',
    excerpt:
      'Hammer is not what you paid. Here is how WhiskyIndex treats premiums, fees, and landed cost in comps.',
    category: 'Guide',
    publishedAt: '2026-02-04',
    updatedAt: null,
    readMinutes: 5,
    cover: 'amber',
    coverAlt: 'Amber cover for buyer premium guide',
    coverCaption: null,
    authorId: 'a2',
    status: 'published',
    featuredRank: null,
    topics: ['Buyer Premiums', 'Auction Prices', 'Valuations'],
    relatedDistilleries: [],
    relatedBottles: [],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: null,
    sources: ['/methodology'],
    blocks: [
      ...paras(
        'Most houses quote hammer separately from buyer premium. We store both and surface total price as the primary series so performance charts match what a winning bidder actually settled.',
        'Seller commissions are excluded from market prints — they are transaction costs for the disposing party, not a property of the bottle.',
        'When comparing private sales to auction comps, adjust carefully: private tickets often omit logistics and insurance that auction totals embed indirectly.'
      ),
      {
        type: 'divider',
      },
      {
        type: 'callout',
        title: 'Rule of thumb',
        text: 'If you only remember hammer, you will systematically understate what buyers paid.',
      },
    ],
  },
  {
    slug: 'campbeltown-supply-squeeze',
    title: 'Campbeltown supply squeeze: why 15-year stock keeps firm',
    excerpt:
      'Constrained distillation years and collector demand keep Springbank-family bottles supported even when broader Scotch is flat.',
    category: 'News',
    publishedAt: '2026-01-22',
    updatedAt: null,
    readMinutes: 7,
    cover: 'peat',
    coverAlt: 'Peat-toned cover for Campbeltown news',
    coverCaption: null,
    authorId: 'a1',
    status: 'published',
    featuredRank: null,
    topics: ['Campbeltown', 'Liquidity', 'Market Trends', 'Collecting'],
    relatedDistilleries: ['springbank'],
    relatedBottles: ['springbank-15'],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: null,
    sources: ['Demo auction history for Springbank 15'],
    blocks: [
      ...paras(
        'Campbeltown remains one of the few regions where production growth has not outpaced collector demand for aged stock. Auction frequency for Springbank 15 is high enough for reliable marks.',
        'That liquidity is a feature for portfolio construction: marks are observable, drawdowns tend to be shallow, and replacement risk stays elevated.',
        'The trade-off is concentration. A Campbeltown-heavy book can look calm until a large private collection hits the same auction calendar.'
      ),
      {
        type: 'bottleRef',
        bottleSlug: 'springbank-15',
      },
      {
        type: 'marketCta',
        label: 'Explore Springbank',
        href: '/distilleries/springbank',
      },
    ],
  },
  {
    slug: 'japanese-whisky-selective-bidding',
    title: 'Japanese whisky: selective bidding returns to aged icons',
    excerpt:
      'Trophy lots need sharper reserves to clear, while core Yamazaki and Hibiki expressions remain more liquid.',
    category: 'News',
    publishedAt: '2026-01-30',
    updatedAt: null,
    readMinutes: 6,
    cover: 'slate',
    coverAlt: 'Slate cover for Japanese whisky news',
    coverCaption: null,
    authorId: 'a3',
    status: 'published',
    featuredRank: null,
    topics: ['Japanese Whisky', 'Auction Prices', 'Liquidity'],
    relatedDistilleries: ['yamazaki', 'karuizawa'],
    relatedBottles: ['yamazaki-12', 'hibiki-21', 'karuizawa-1984'],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: null,
    sources: ['Illustrative February market close'],
    blocks: [
      ...paras(
        'Aged Japanese icons continue to clear, but buyers are more selective on reserve levels and packaging. Core expressions with deeper auction history still provide more reliable marks than single-cask trophies.'
      ),
      {
        type: 'bottleRef',
        bottleSlug: 'yamazaki-12',
      },
      {
        type: 'bottleRef',
        bottleSlug: 'karuizawa-1984',
      },
      {
        type: 'marketCta',
        label: 'Screen Japanese bottles',
        href: '/screener?country=Japan',
      },
    ],
  },
  {
    slug: 'liquidity-and-rarity-are-not-the-same',
    title: 'Liquidity and rarity are not the same',
    excerpt:
      'A practical guide to reading auction frequency without mistaking thin trading for intrinsic scarcity.',
    category: 'Guide',
    publishedAt: '2026-01-08',
    updatedAt: null,
    readMinutes: 6,
    cover: 'peat',
    coverAlt: 'Peat cover for liquidity guide',
    coverCaption: null,
    authorId: 'a2',
    status: 'published',
    featuredRank: null,
    topics: ['Liquidity', 'Collecting', 'Whisky Investing', 'Valuations'],
    relatedDistilleries: [],
    relatedBottles: ['bowmore-black-bowmore', 'lagavulin-16'],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: null,
    sources: ['/methodology'],
    blocks: [
      ...paras(
        'Rarely seen at auction does not automatically mean rare in existence — and frequently traded does not mean common or inexpensive.',
        'WhiskyIndex liquidity labels are based on recorded 12-month sale counts for a canonical bottle. They describe market observability, not quality.'
      ),
      {
        type: 'ul',
        items: [
          'Frequently traded: enough comps for tighter medians',
          'Infrequently traded: wider uncertainty around any single mark',
          'Rarely seen: withhold aggressive performance claims',
        ],
      },
      {
        type: 'bottleRef',
        bottleSlug: 'lagavulin-16',
      },
      {
        type: 'bottleRef',
        bottleSlug: 'bowmore-black-bowmore',
      },
    ],
  },
  {
    slug: 'january-2026-whisky-market-report',
    title: 'January 2026 whisky market report',
    excerpt:
      'Year-open auction turnover cooled from December peaks while Campbeltown and Islay core lines stayed active.',
    category: 'Market Report',
    publishedAt: '2026-02-01',
    updatedAt: null,
    readMinutes: 8,
    cover: 'slate',
    coverAlt: 'Slate cover for January market report',
    coverCaption: 'Reporting period January 2026',
    authorId: 'a1',
    status: 'published',
    featuredRank: null,
    topics: ['Market Trends', 'Auction Prices'],
    relatedDistilleries: [],
    relatedBottles: [],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: 'January 2026',
    sources: ['Illustrative WhiskyIndex monthly close'],
    blocks: [
      {
        type: 'stats',
        period: 'January 2026 (illustrative snapshot)',
        source: 'WhiskyIndex demo market close',
        items: [
          { label: 'Auction turnover', value: '£17.6m' },
          { label: 'Bottles sold', value: '24,010' },
          { label: 'Unique bottles', value: '6,040' },
        ],
      },
      ...paras(
        'January typically softens after year-end auction calendars. This year’s open followed that seasonal pattern without a sharp break in core Scotch liquidity.'
      ),
      {
        type: 'marketCta',
        label: 'View auction activity',
        href: '/auctions',
      },
    ],
  },
  // Draft — excluded from published listings
  {
    slug: 'draft-q1-outlook',
    title: 'Q1 outlook draft (unpublished)',
    excerpt: 'Internal draft — not for public listing.',
    category: 'Analysis',
    publishedAt: '2026-03-15',
    updatedAt: null,
    readMinutes: 4,
    cover: 'oak',
    coverAlt: 'Draft cover',
    coverCaption: null,
    authorId: 'a1',
    status: 'draft',
    featuredRank: null,
    topics: ['Market Trends'],
    relatedDistilleries: [],
    relatedBottles: [],
    seoTitle: null,
    seoDescription: null,
    reportingPeriod: null,
    sources: [],
    blocks: paras('This draft is excluded from the public Insights hub.'),
  },
];

export const articles: Article[] = raw.map((a) => ({
  ...a,
  body: bodyFromBlocks(a.blocks),
}));

export function getAuthor(id: string) {
  return authors.find((a) => a.id === id);
}

export function getAuthorBySlug(slug: string) {
  return authors.find((a) => a.slug === slug);
}

export function publishedArticles() {
  return articles.filter((a) => a.status === 'published');
}

export function getArticle(slug: string) {
  if ((RESERVED_INSIGHT_SLUGS as readonly string[]).includes(slug)) return undefined;
  return publishedArticles().find((a) => a.slug === slug);
}

/** Include drafts only for generateStaticParams exclusion — public getArticle filters status */
export function allArticleSlugs() {
  return publishedArticles().map((a) => a.slug);
}

export function latestArticles(limit = 3) {
  return [...publishedArticles()]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export function featuredArticles() {
  const ranked = publishedArticles()
    .filter((a) => a.featuredRank != null)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
  return {
    primary: ranked[0] ?? null,
    secondary: ranked.slice(1, 3),
  };
}

export function latestMarketReport() {
  return (
    [...publishedArticles()]
      .filter((a) => a.category === 'Market Report')
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0] ?? null
  );
}

export function categoryFromRoute(route: string): ArticleCategory | null {
  const entry = Object.entries(CATEGORY_META).find(([, v]) => v.route === route);
  return (entry?.[0] as ArticleCategory) ?? null;
}

export function categoryPath(category: ArticleCategory) {
  return `/insights/${CATEGORY_META[category].route}`;
}

export function articlesByAuthor(authorId: string, excludeSlug?: string, limit = 3) {
  return publishedArticles()
    .filter((a) => a.authorId === authorId && a.slug !== excludeSlug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export function relatedArticles(article: Article, limit = 3) {
  return publishedArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      const topicScore = a.topics.filter((t) => article.topics.includes(t)).length * 3;
      const distScore =
        a.relatedDistilleries.filter((d) => article.relatedDistilleries.includes(d)).length * 2;
      const catScore = a.category === article.category ? 2 : 0;
      return { article: a, score: topicScore + distScore + catScore };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.article.publishedAt.localeCompare(a.article.publishedAt)
    )
    .slice(0, limit)
    .map((x) => x.article);
}

export function articleHeadings(article: Article) {
  return article.blocks.filter(
    (b): b is Extract<ArticleBlock, { type: 'h2' }> => b.type === 'h2'
  );
}

export type InsightFilters = {
  category?: ArticleCategory;
  q?: string;
  topic?: string;
  distillery?: string;
  sort?: 'date_desc' | 'date_asc';
  page?: number;
};

export const INSIGHTS_PAGE_SIZE = 6;

export function filterArticles(filters: InsightFilters) {
  let rows = [...publishedArticles()];
  if (filters.category) rows = rows.filter((a) => a.category === filters.category);
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((a) => {
      const hay = [
        a.title,
        a.excerpt,
        a.topics.join(' '),
        a.relatedDistilleries.join(' '),
        a.body.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (filters.topic) rows = rows.filter((a) => a.topics.includes(filters.topic!));
  if (filters.distillery) {
    rows = rows.filter((a) =>
      a.relatedDistilleries.includes(filters.distillery!.toLowerCase())
    );
  }
  rows.sort((a, b) =>
    filters.sort === 'date_asc'
      ? a.publishedAt.localeCompare(b.publishedAt)
      : b.publishedAt.localeCompare(a.publishedAt)
  );
  const page = Math.max(1, filters.page ?? 1);
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / INSIGHTS_PAGE_SIZE));
  const start = (page - 1) * INSIGHTS_PAGE_SIZE;
  return {
    rows: rows.slice(start, start + INSIGHTS_PAGE_SIZE),
    total,
    page,
    pageCount,
  };
}

export function parseInsightSearchParams(sp: {
  q?: string;
  topic?: string;
  distillery?: string;
  sort?: string;
  page?: string;
}): InsightFilters {
  return {
    q: sp.q || undefined,
    topic: sp.topic || undefined,
    distillery: sp.distillery || undefined,
    sort: sp.sort === 'date_asc' ? 'date_asc' : 'date_desc',
    page: sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1,
  };
}

export function insightQueryString(filters: InsightFilters, extras?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.topic) params.set('topic', filters.topic);
  if (filters.distillery) params.set('distillery', filters.distillery);
  if (filters.sort && filters.sort !== 'date_desc') params.set('sort', filters.sort);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  if (extras) {
    for (const [k, v] of Object.entries(extras)) {
      if (v) params.set(k, v);
    }
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function formatArticleDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatArticleDateLong(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
