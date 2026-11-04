import type { Article } from './types';

export const articles: Article[] = [
  {
    slug: 'secondary-market-march-pulse',
    title: 'Secondary market pulse: Scotch steady, Japan still digesting',
    excerpt:
      'Auction clearances held firm through February closes. Islay benchmarks bid tight while aged Japanese icons remain selective.',
    category: 'Market Report',
    publishedAt: '2026-03-01',
    readMinutes: 6,
    cover: 'slate',
    body: [
      'Hammer prices across major UK auction houses finished February within a narrow band of January prints. Volume was healthier in Campbeltown and Islay core expressions, while trophy Japanese lots needed sharper reserves to clear.',
      'Macallan sherry oak continuum bottles saw modest month-on-month gains, helped by predictable release cadence and deep buyer pools. Rare Cask continued to lag, with wider bid-ask spreads on mid-condition bottles.',
      'For collectors running model portfolios, the signal is rotation rather than risk-off: liquidity is concentrating in bottles with frequent auction comps and transparent packing notes.',
    ],
  },
  {
    slug: 'how-we-build-bottle-indexes',
    title: 'How WhiskyIndex constructs bottle and segment indexes',
    excerpt:
      'A plain-English walkthrough of observation windows, currency normalisation, and why we cap single-bottle weights.',
    category: 'Analysis',
    publishedAt: '2026-02-18',
    readMinutes: 8,
    cover: 'oak',
    body: [
      'Each index observation window is a calendar month of closed auctions. Prices are converted to GBP before aggregation, then filtered for incomplete lots and withdrawn sales.',
      'Bottle-level returns are volume-weighted within the segment, with a hard cap so a single ultra-rare lot cannot dominate the WI Rare series.',
      'Missing months for thinly traded bottles are carried with linear interpolation for index construction only — never for the bottle detail latest price.',
    ],
  },
  {
    slug: 'reading-auction-premiums',
    title: 'Reading buyer premiums without fooling yourself',
    excerpt:
      'Hammer is not what you paid. Here is how WhiskyIndex treats premiums, fees, and landed cost in comps.',
    category: 'Guide',
    publishedAt: '2026-02-04',
    readMinutes: 5,
    cover: 'amber',
    body: [
      'Most houses quote hammer separately from buyer premium. We store both and surface total price as the primary series so performance charts match what a winning bidder actually settled.',
      'Seller commissions are excluded from market prints — they are transaction costs for the disposing party, not a property of the bottle.',
      'When comparing private sales to auction comps, adjust carefully: private tickets often omit logistics and insurance that auction totals embed indirectly.',
    ],
  },
  {
    slug: 'campbeltown-supply-squeeze',
    title: 'Campbeltown supply squeeze: why 15-year stock keeps firm',
    excerpt:
      'Constrained distillation years and collector demand keep Springbank-family bottles supported even when broader Scotch is flat.',
    category: 'News',
    publishedAt: '2026-01-22',
    readMinutes: 7,
    cover: 'peat',
    body: [
      'Campbeltown remains one of the few regions where production growth has not outpaced collector demand for aged stock. Auction frequency for Springbank 15 is high enough for reliable marks.',
      'That liquidity is a feature for portfolio construction: marks are observable, drawdowns tend to be shallow, and replacement risk stays elevated.',
      'The trade-off is concentration. A Campbeltown-heavy book can look calm until a large private collection hits the same auction calendar.',
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function latestArticles(limit = 3) {
  return [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
