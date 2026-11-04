import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'WhiskyIndex provides illustrative secondary-market analytics for product demonstration — not investment advice.',
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Disclaimer</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        WhiskyIndex provides illustrative secondary-market analytics for product demonstration.
        Nothing on this site is investment advice. Auction marks can diverge from private transaction
        prices. Past performance is not a reliable indicator of future results.
      </p>
      <Link href="/terms" className="mt-8 inline-block text-sm font-medium text-ink hover:underline">
        Terms of Service →
      </Link>
    </div>
  );
}
