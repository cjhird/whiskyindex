import { getRecentAuctionResults, type AuctionResultRow } from './auctions';
import { slugifyName } from './bottles';

export type AuctionHouse = {
  slug: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  website: string;
  cadence: string;
  buyerPremium: string;
  currency: 'GBP' | 'EUR' | 'USD' | 'Mixed';
  founded: number | null;
  focus: string;
  summary: string;
  notes: string[];
};

/** Houses covered in the demo auction universe — keep names aligned with lot generators. */
export const auctionHouses: AuctionHouse[] = [
  {
    slug: 'whisky-auctioneer',
    name: 'Whisky Auctioneer',
    shortName: 'Whisky Auctioneer',
    country: 'United Kingdom',
    city: 'Perth',
    website: 'https://whiskyauctioneer.com',
    cadence: 'Timed online sales · roughly fortnightly',
    buyerPremium: 'Buyer’s premium typically applied on hammer (demo uses recorded totals)',
    currency: 'GBP',
    founded: 2013,
    focus: 'Rare and collectible Scotch, Japanese, and world whisky',
    summary:
      'Specialist online whisky auction house with broad secondary-market coverage. WhiskyIndex indexes closed lots matched to canonical bottle identities for mark and liquidity research.',
    notes: [
      'Condition and packaging notes vary by lot listing',
      'Totals on WhiskyIndex prefer buyer-inclusive where recorded',
      'Lot URLs open the house site when available in the demo set',
    ],
  },
  {
    slug: 'scotch-whisky-auctions',
    name: 'Scotch Whisky Auctions',
    shortName: 'Scotch Whisky Auctions',
    country: 'United Kingdom',
    city: 'Glasgow',
    website: 'https://www.scotchwhiskyauctions.com',
    cadence: 'Regular online catalogues',
    buyerPremium: 'Buyer’s premium on hammer — see house terms',
    currency: 'GBP',
    founded: 2012,
    focus: 'Scotch-led catalogues with strong independent bottler depth',
    summary:
      'Glasgow-based online auctioneer frequently appearing in WhiskyIndex comps for core and indie Scotch releases.',
    notes: [
      'Useful for Campbeltown and Islay frequency checks',
      'Demo sample is illustrative — not a full house archive',
    ],
  },
  {
    slug: 'just-whisky',
    name: 'Just Whisky',
    shortName: 'Just Whisky',
    country: 'United Kingdom',
    city: 'United Kingdom',
    website: 'https://www.just-whisky.co.uk',
    cadence: 'Scheduled online auctions',
    buyerPremium: 'Buyer’s premium on hammer — see house terms',
    currency: 'GBP',
    founded: null,
    focus: 'Collectible whisky across regions with frequent mid-market lots',
    summary:
      'UK specialist auctioneer contributing mid- and high-liquidity comps across the tracked bottle universe.',
    notes: ['Fill and box notes help condition-adjusted reading of marks'],
  },
  {
    slug: 'whisky-online-auctions',
    name: 'Whisky Online Auctions',
    shortName: 'Whisky Online Auctions',
    country: 'United Kingdom',
    city: 'United Kingdom',
    website: 'https://www.whiskyonlineauctions.com',
    cadence: 'Recurring timed sales',
    buyerPremium: 'Buyer’s premium on hammer — see house terms',
    currency: 'GBP',
    founded: null,
    focus: 'Online whisky lots spanning Scotch and international bottles',
    summary:
      'Online auction venue indexed for closed-lot evidence alongside other UK specialist houses.',
    notes: ['Currency treated as GBP in this demo sample'],
  },
  {
    slug: 'grand-whisky-auction',
    name: 'Grand Whisky Auction',
    shortName: 'Grand Whisky Auction',
    country: 'United Kingdom',
    city: 'United Kingdom',
    website: 'https://www.thegrandwhiskyauction.com',
    cadence: 'Regular online catalogues',
    buyerPremium: 'Buyer’s premium on hammer — see house terms',
    currency: 'GBP',
    founded: null,
    focus: 'Collectible and investment-interest whisky catalogues',
    summary:
      'Specialist house appearing in WhiskyIndex recent results for trophy and core expressions.',
    notes: ['Illustrative coverage only in this product demo'],
  },
];

export function getAuctionHouseBySlug(slug: string) {
  return auctionHouses.find((h) => h.slug === slug);
}

export function getAuctionHouseByName(name: string) {
  return auctionHouses.find((h) => h.name === name) ??
    auctionHouses.find((h) => slugifyName(h.name) === slugifyName(name));
}

export function auctionHouseSlug(name: string) {
  return getAuctionHouseByName(name)?.slug ?? slugifyName(name);
}

export function resultsForHouse(slug: string, limit = 80): AuctionResultRow[] {
  const house = getAuctionHouseBySlug(slug);
  if (!house) return [];
  return getRecentAuctionResults(200)
    .filter((r) => r.house === house.name)
    .slice(0, limit);
}

export function houseStats(slug: string) {
  const rows = resultsForHouse(slug, 200);
  const turnover = rows.reduce((s, r) => s + r.totalGbp, 0);
  const avgLot = rows.length ? turnover / rows.length : 0;
  const bottles = new Set(rows.map((r) => r.bottleSlug)).size;
  const latest = rows[0]?.date ?? null;
  return {
    lots: rows.length,
    turnover,
    avgLot,
    uniqueBottles: bottles,
    latestSale: latest,
  };
}
