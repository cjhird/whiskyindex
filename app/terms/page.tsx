import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using WhiskyIndex illustrative secondary-market analytics. Not investment, legal, or tax advice.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Terms</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          By using WhiskyIndex you agree that the site provides illustrative secondary-market
          analytics for whisky collectors and product demonstration. These demo terms are a short
          summary until a production agreement ships.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Use of the service</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Content is for personal research and evaluation of the product design</li>
          <li>Do not scrape, resell, or present demo marks as live market prints</li>
          <li>Account features in this build are mock sessions without paid entitlements</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">No advice</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Nothing on this site is investment, legal, or tax advice. Auction marks can differ from
          private sale prices. Past performance is not a reliable guide to future results. See the{' '}
          <Link href="/disclaimer" className="text-ink hover:underline">
            disclaimer
          </Link>{' '}
          and{' '}
          <Link href="/methodology" className="text-ink hover:underline">
            methodology
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
