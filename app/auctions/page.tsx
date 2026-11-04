import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentAuctionResults } from '@/lib/mock/auctions';
import { formatGBP } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Auction results',
  description: 'Recent whisky auction comps across indexed bottles.',
};

export default function AuctionsPage() {
  const rows = getRecentAuctionResults(48);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Auction results</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Recent closed lots with hammer, premium, and landed total (GBP comparison).
          </p>
        </div>
        <Link href="/bottles" className="text-sm text-ink-muted hover:text-ink">
          Bottle database →
        </Link>
      </div>

      <div className="mobile-card-list">
        {rows.map((r) => (
          <Link key={r.id} href={`/bottles/${r.bottleSlug}`} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{r.bottleName}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {r.house} · {r.date} · Lot {r.lot}
                </p>
              </div>
              <p className="font-mono-num text-sm font-semibold">{formatGBP(r.totalGbp)}</p>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              {r.condition} · {r.currency} {r.hammer.toLocaleString('en-GB')} hammer
              {r.currency !== 'GBP' ? ` · ${formatGBP(r.totalGbp)} GBP` : ''}
            </p>
          </Link>
        ))}
      </div>

      <div className="desktop-table-only overflow-hidden">
        <div className="data-table-wrap max-h-[75vh]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bottle</th>
                <th>House</th>
                <th>Lot</th>
                <th>Condition</th>
                <th className="text-right">Hammer</th>
                <th className="text-right">Currency</th>
                <th className="text-right">Total (GBP)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap font-mono-num text-ink-muted">{r.date}</td>
                  <td>
                    <Link href={`/bottles/${r.bottleSlug}`} className="font-medium text-ink hover:underline">
                      {r.bottleName}
                    </Link>
                    <p className="text-sm text-ink-muted">{r.brand}</p>
                  </td>
                  <td className="text-ink-muted">{r.house}</td>
                  <td className="font-mono-num text-ink-muted">{r.lot}</td>
                  <td className="text-ink-muted">{r.condition}</td>
                  <td className="text-right font-mono-num">
                    {r.currency} {r.hammer.toLocaleString('en-GB')}
                  </td>
                  <td className="text-right font-mono-num text-ink-muted">{r.currency}</td>
                  <td className="text-right font-mono-num font-semibold">{formatGBP(r.totalGbp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
