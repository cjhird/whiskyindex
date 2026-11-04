import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'WhiskyIndex provides illustrative secondary-market analytics for product demonstration — not investment advice.',
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Disclaimer</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          WhiskyIndex provides illustrative secondary-market analytics for product demonstration.
          Figures, charts, indices, portfolios, and articles on this demo are not live auction
          prints and must not be used as the sole basis for buying, selling, or valuing whisky.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Investment and advice</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Nothing on WhiskyIndex is investment, legal, tax, or collecting advice. Rare whisky can be
          illiquid; auction results can diverge from private transactions; packaging, fill level,
          and authenticity affect realised prices. Past performance is not a reliable indicator of
          future results.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Data limitations</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Coverage, matching rules, FX conversion, and liquidity classes are described in{' '}
          <Link href="/methodology" className="text-ink hover:underline">
            Methodology
          </Link>{' '}
          and{' '}
          <Link href="/data-sources" className="text-ink hover:underline">
            Data sources
          </Link>
          . Planned indices are labelled as such and are not production benchmarks.
        </p>
      </section>

      <Link href="/terms" className="inline-block text-sm font-medium text-ink hover:underline">
        Terms of Service →
      </Link>
    </div>
  );
}
