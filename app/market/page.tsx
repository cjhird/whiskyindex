import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeMarket } from '@/components/HomeMarket';

export const metadata: Metadata = {
  title: 'Market overview',
  description: 'Whisky secondary-market board, movers, and watch collections.',
};

export default function MarketPage() {
  return (
    <div>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Market overview</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Indexes, movers, and curated collections across the auction universe.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/market/indices" className="text-ink-muted hover:text-ink">
              Indices →
            </Link>
            <Link href="/auctions" className="text-ink-muted hover:text-ink">
              Auction results →
            </Link>
            <Link href="/screener" className="text-ink-muted hover:text-ink">
              Screener →
            </Link>
          </div>
        </div>
      </div>
      <HomeMarket />
    </div>
  );
}
