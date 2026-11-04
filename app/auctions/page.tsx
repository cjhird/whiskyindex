import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentAuctionResults } from '@/lib/mock/auctions';
import { AuctionsDashboard } from '@/components/auctions/AuctionsDashboard';

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
            month, sort columns, and open the matched bottle profile.
          </p>
        </div>
        <Link href="/bottles" className="text-sm text-ink-muted hover:text-ink">
          Bottle database →
        </Link>
      </div>

      <AuctionsDashboard rows={rows} />
    </div>
  );
}
