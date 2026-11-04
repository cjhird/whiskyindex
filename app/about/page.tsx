import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'WhiskyIndex is a research surface for secondary-market whisky auction marks, comps, and collector analytics.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">About WhiskyIndex</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          WhiskyIndex is a market intelligence platform for the secondary whisky market — focused on
          rare and collectible bottles sold through auctions. We organise closed-lot evidence so
          collectors can research marks, comps, and liquidity without treating the product as a
          trading venue or advice service.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">What it is</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Auction-mark research for bottles, distilleries, and market segments</li>
          <li>A screener, insights publication, and optional demo portfolio / watchlist</li>
          <li>Transparent methodology notes for how evidence is summarised</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">What it isn&apos;t</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Not a broker, auction house, or marketplace</li>
          <li>Not investment, tax, or legal advice</li>
          <li>Not a live feed in this demo build — marks are illustrative product data</li>
        </ul>
      </section>

      <p className="text-sm text-ink-muted">
        Read the{' '}
        <Link href="/methodology" className="text-ink hover:underline">
          methodology
        </Link>
        ,{' '}
        <Link href="/data-sources" className="text-ink hover:underline">
          data sources
        </Link>
        , or{' '}
        <Link href="/market" className="text-ink hover:underline">
          explore the market
        </Link>
        .
      </p>
    </div>
  );
}
