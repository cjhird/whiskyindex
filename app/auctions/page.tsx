import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentAuctionResults } from '@/lib/mock/auctions';
import { auctionHouses, houseStats } from '@/lib/mock/auctionHouses';
import { AuctionsDashboard } from '@/components/auctions/AuctionsDashboard';
import { formatGBP } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Auction results',
  description:
    'Browse closed whisky auction comps with house and month filters, sort, and bottle deep-links.',
};

export default function AuctionsPage() {
  const rows = getRecentAuctionResults(200);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Auction results</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Closed lots with hammer, premium, and landed total (GBP comparison). Filter by house or
            month, sort columns, and open house profiles or bottle pages.
          </p>
        </div>
        <Link href="/bottles" className="text-sm text-ink-muted hover:text-ink">
          Bottle database →
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-ink">Auction houses</h2>
        <ul className="mt-3 grid gap-0 divide-y divide-line border-y border-line sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 lg:grid-cols-3">
          {auctionHouses.map((h) => {
            const stats = houseStats(h.slug);
            return (
              <li key={h.slug} className="border-b border-line sm:border-0">
                <Link href={`/auctions/${h.slug}`} className="row-hover block py-4">
                  <p className="font-medium text-ink">{h.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {h.city} · {stats.lots} lots · {formatGBP(stats.turnover, { compact: true })}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <AuctionsDashboard rows={rows} />
    </div>
  );
}
