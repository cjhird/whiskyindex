import { bottles, getBottleBySlug } from './bottles';
import type { WatchlistItem } from './types';

export const watchlistItems: WatchlistItem[] = [
  { bottleId: 'b1', addedAt: '2026-01-12', note: 'Track sherry oak continuum' },
  { bottleId: 'b3', addedAt: '2026-01-28' },
  { bottleId: 'b4', addedAt: '2026-02-04', note: 'Spread still wide' },
  { bottleId: 'b7', addedAt: '2026-02-18' },
  { bottleId: 'b12', addedAt: '2026-02-26', note: 'Islay benchmark' },
];

export function getWatchlistRows() {
  return watchlistItems
    .map((item) => {
      const bottle = bottles.find((b) => b.id === item.bottleId);
      if (!bottle) return null;
      return { ...item, bottle };
    })
    .filter(Boolean) as Array<
    WatchlistItem & { bottle: NonNullable<ReturnType<typeof getBottleBySlug>> }
  >;
}
