import type { AuctionComp } from '@/lib/mock/auctions';
import { formatGBP } from '@/lib/format';

export function AuctionCompsTable({ comps }: { comps: AuctionComp[] }) {
  return (
    <div className="surface overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Auction comps</h2>
          <p className="text-xs text-ink-muted">Total = hammer + buyer premium</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-accent-soft/70 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">House</th>
              <th className="px-4 py-2.5 font-medium">Lot</th>
              <th className="px-4 py-2.5 font-medium">Condition</th>
              <th className="px-4 py-2.5 font-medium text-right">Hammer</th>
              <th className="px-4 py-2.5 font-medium text-right">Premium</th>
              <th className="px-4 py-2.5 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {comps.map((c) => (
              <tr key={c.id} className="hover:bg-accent-soft/40">
                <td className="whitespace-nowrap px-4 py-2.5 font-mono-num text-ink-muted">
                  {c.date}
                </td>
                <td className="px-4 py-2.5 text-ink">{c.house}</td>
                <td className="px-4 py-2.5 font-mono-num text-ink-muted">{c.lot}</td>
                <td className="px-4 py-2.5 text-ink-muted">{c.condition}</td>
                <td className="px-4 py-2.5 text-right font-mono-num">{formatGBP(c.hammer)}</td>
                <td className="px-4 py-2.5 text-right font-mono-num text-ink-muted">
                  {formatGBP(c.premium)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono-num font-medium">
                  {formatGBP(c.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
