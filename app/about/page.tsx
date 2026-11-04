import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'WhiskyIndex is a research surface for secondary-market whisky auction marks, comps, and collector analytics.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">About WhiskyIndex</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        WhiskyIndex is a market intelligence platform for the secondary whisky market — focused on
        rare and collectible bottles sold through auctions. This build is a product design preview
        with illustrative data, not live prints or investment advice.
      </p>
      <Link href="/market" className="mt-8 inline-block text-sm font-medium text-ink hover:underline">
        Explore the market →
      </Link>
    </div>
  );
}
