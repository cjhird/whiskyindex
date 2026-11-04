import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using WhiskyIndex illustrative secondary-market analytics. Not investment, legal, or tax advice.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Terms</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        WhiskyIndex provides illustrative secondary-market analytics for whisky collectors. Nothing on
        this site is investment, legal, or tax advice. Auction marks can differ from private sale
        prices, and past performance is not a reliable guide to future results.
      </p>
    </div>
  );
}
