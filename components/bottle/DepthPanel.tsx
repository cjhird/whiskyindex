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

  return (
    <div className="surface overflow-hidden rounded-lg">
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Indicative depth</h2>
        <p className="text-xs text-ink-muted">Illustrative interest around the latest mark</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-line">
        <div className="p-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-up">Bids</p>
          <ul className="space-y-1.5">
            {bids.map((b) => (
              <li key={`bid-${b.price}`} className="relative overflow-hidden rounded px-2 py-1.5">
                <span
                  className="absolute inset-y-0 right-0 bg-up-soft"
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
        <div className="p-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-down">Asks</p>
          <ul className="space-y-1.5">
            {asks.map((a) => (
              <li key={`ask-${a.price}`} className="relative overflow-hidden rounded px-2 py-1.5">
                <span
                  className="absolute inset-y-0 left-0 bg-down-soft"
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
