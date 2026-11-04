import type { AuctionComp } from '@/lib/mock/auctions';
import { formatGBP } from '@/lib/format';

export function AuctionCompsTable({ comps }: { comps: AuctionComp[] }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink">Auction comps</h2>
        <p className="mt-1 text-sm text-ink-muted">Total includes hammer + buyer premium</p>
      </div>

      <div className="mobile-card-list">
        {comps.map((c) => (
          <div key={c.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">{c.house}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {c.date} · Lot {c.lot}
                </p>
              </div>
              <p className="font-mono-num text-sm font-semibold">{formatGBP(c.total)}</p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span>{c.condition}</span>
              <span>Hammer {formatGBP(c.hammer)}</span>
              <span>Premium {formatGBP(c.premium)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="desktop-table-only">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>House</th>
                <th>Lot</th>
                <th>Condition</th>
                <th className="text-right">Hammer</th>
                <th className="text-right">Premium</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {comps.map((c) => (
                <tr key={c.id}>
                  <td className="whitespace-nowrap font-mono-num text-ink-muted">{c.date}</td>
                  <td className="font-medium text-ink">{c.house}</td>
                  <td className="font-mono-num text-ink-muted">{c.lot}</td>
                  <td className="text-ink-muted">{c.condition}</td>
                  <td className="text-right font-mono-num">{formatGBP(c.hammer)}</td>
                  <td className="text-right font-mono-num text-ink-muted">{formatGBP(c.premium)}</td>
                  <td className="text-right font-mono-num font-semibold">{formatGBP(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
