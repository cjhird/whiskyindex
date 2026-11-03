import { bottles, getBottleBySlug } from './bottles';
import type { PortfolioHolding } from './types';

export const portfolioHoldings: PortfolioHolding[] = [
  {
    bottleId: 'b1',
    quantity: 2,
    purchasePrice: 420,
    purchaseDate: '2023-06-14',
    notes: 'Original tubes, UK duty paid',
  },
  {
    bottleId: 'b2',
    quantity: 3,
    purchasePrice: 145,
    purchaseDate: '2024-01-09',
  },
  {
    bottleId: 'b5',
    quantity: 1,
    purchasePrice: 860,
    purchaseDate: '2022-11-02',
    notes: 'Box + certificate',
  },
  {
    bottleId: 'b6',
    quantity: 4,
    purchasePrice: 68,
    purchaseDate: '2025-04-21',
  },
  {
    bottleId: 'b11',
    quantity: 1,
    purchasePrice: 990,
    purchaseDate: '2024-08-30',
  },
];

export function getPortfolioRows() {
  return portfolioHoldings
    .map((h) => {
      const bottle = bottles.find((b) => b.id === h.bottleId);
      if (!bottle) return null;
      const marketValue = bottle.latestPrice * h.quantity;
      const cost = h.purchasePrice * h.quantity;
      const pnl = marketValue - cost;
      const pnlPct = (pnl / cost) * 100;
      return { ...h, bottle, marketValue, cost, pnl, pnlPct };
    })
    .filter(Boolean) as Array<
    PortfolioHolding & {
      bottle: NonNullable<ReturnType<typeof getBottleBySlug>>;
      marketValue: number;
      cost: number;
      pnl: number;
      pnlPct: number;
    }
  >;
}

export function portfolioSummary() {
  const rows = getPortfolioRows();
  const marketValue = rows.reduce((s, r) => s + r.marketValue, 0);
  const cost = rows.reduce((s, r) => s + r.cost, 0);
  const pnl = marketValue - cost;
  const pnlPct = cost ? (pnl / cost) * 100 : 0;
  const dayPnl = rows.reduce((s, r) => s + (r.bottle.latestPrice * r.bottle.change1d) / 100 * r.quantity, 0);
  return { marketValue, cost, pnl, pnlPct, dayPnl, positions: rows.length };
}
