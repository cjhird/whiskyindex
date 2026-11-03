import type { OrderBookLevel } from '@/lib/mock/auctions';
import { formatGBP } from '@/lib/format';

export function DepthPanel({
  bids,
  asks,
}: {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}) {
  const maxSize = Math.max(...bids.map((b) => b.size), ...asks.map((a) => a.size), 1);
  const bestBid = bids[0]?.price ?? 0;
  const bestAsk = asks[0]?.price ?? 0;
  const mid = (bestBid + bestAsk) / 2;
  const spread = bestAsk - bestBid;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Depth</h2>
        <p className="text-xs text-ink-muted">
          Mid {formatGBP(mid)} · Spread {formatGBP(spread)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="label-meta mb-2 text-up">Bids</p>
          <ul className="space-y-1">
            {bids.map((b) => (
              <li key={`bid-${b.price}`} className="relative overflow-hidden rounded px-1.5 py-1">
                <span
                  className="absolute inset-y-0 right-0 bg-up-soft/80"
                  style={{ width: `${(b.size / maxSize) * 100}%` }}
                />
                <span className="relative flex justify-between font-mono-num text-xs">
                  <span className="text-up">{formatGBP(b.price)}</span>
                  <span className="text-ink-muted">×{b.size}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-meta mb-2 text-down">Asks</p>
          <ul className="space-y-1">
            {asks.map((a) => (
              <li key={`ask-${a.price}`} className="relative overflow-hidden rounded px-1.5 py-1">
                <span
                  className="absolute inset-y-0 left-0 bg-down-soft/80"
                  style={{ width: `${(a.size / maxSize) * 100}%` }}
                />
                <span className="relative flex justify-between font-mono-num text-xs">
                  <span className="text-down">{formatGBP(a.price)}</span>
                  <span className="text-ink-muted">×{a.size}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
