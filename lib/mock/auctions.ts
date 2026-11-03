import type { Bottle } from './types';

export type AuctionComp = {
  id: string;
  house: string;
  lot: string;
  date: string;
  hammer: number;
  premium: number;
  total: number;
  currency: 'GBP';
  condition: string;
};

export type OrderBookLevel = {
  price: number;
  size: number;
};

const HOUSES = [
  'Whisky Auctioneer',
  'Scotch Whisky Auctions',
  'Just Whisky',
  'Whisky Online Auctions',
  'Grand Whisky Auction',
];

function seeded(n: number) {
  const x = Math.sin(n * 999) * 10000;
  return x - Math.floor(x);
}

export function getAuctionComps(bottle: Bottle, count = 8): AuctionComp[] {
  const comps: AuctionComp[] = [];
  for (let i = 0; i < count; i++) {
    const r = seeded(bottle.latestPrice + i * 17);
    const drift = 1 + (r - 0.5) * 0.12 - i * 0.008;
    const hammer = Math.round(bottle.latestPrice * drift * 0.91);
    const premium = Math.round(hammer * 0.12);
    const d = new Date('2026-02-28');
    d.setDate(d.getDate() - i * 18 - Math.floor(r * 6));
    comps.push({
      id: `${bottle.id}-lot-${i}`,
      house: HOUSES[i % HOUSES.length],
      lot: `${1200 + i * 37}`,
      date: d.toISOString().slice(0, 10),
      hammer,
      premium,
      total: hammer + premium,
      currency: 'GBP',
      condition: r > 0.7 ? 'Box + papers' : r > 0.35 ? 'Original tube' : 'Bottle only',
    });
  }
  return comps;
}

export function getOrderBook(bottle: Bottle): { bids: OrderBookLevel[]; asks: OrderBookLevel[] } {
  const mid = bottle.latestPrice;
  const bids = Array.from({ length: 5 }, (_, i) => ({
    price: Math.round(mid * (0.985 - i * 0.012)),
    size: Math.max(1, Math.round(seeded(mid + i) * 6)),
  }));
  const asks = Array.from({ length: 5 }, (_, i) => ({
    price: Math.round(mid * (1.015 + i * 0.012)),
    size: Math.max(1, Math.round(seeded(mid + i + 9) * 5)),
  }));
  return { bids, asks };
}

export function getRelatedBottles(bottle: Bottle, all: Bottle[], limit = 4) {
  return all
    .filter((b) => b.id !== bottle.id)
    .map((b) => ({
      bottle: b,
      score:
        (b.brand === bottle.brand ? 5 : 0) +
        (b.region === bottle.region ? 3 : 0) +
        (b.country === bottle.country ? 1 : 0) -
        Math.abs(b.latestPrice - bottle.latestPrice) / Math.max(bottle.latestPrice, 1),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.bottle);
}
