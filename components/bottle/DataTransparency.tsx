import Link from 'next/link';
import { DATA_AS_OF } from '@/lib/mock/auctions';

export function DataTransparency() {
  const refreshed = new Date(`${DATA_AS_OF}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-sm font-semibold text-ink">Data & methodology</h2>
      <ul className="mt-3 max-w-3xl space-y-2 text-sm leading-6 text-ink-muted">
        <li>
          Auction evidence is drawn from closed lots at major secondary-market houses. This demo
          uses illustrative placeholders — see{' '}
          <Link href="/data-sources" className="text-ink hover:underline">
            data sources
          </Link>
          .
        </li>
        <li>Most recent data refresh (demo clock): {refreshed}.</li>
        <li>
          Lots are matched to a canonical bottle identity (vintage, edition, bottling year, size).
          Multi-bottle lots and gift sets are excluded unless normalised.
        </li>
        <li>
          Primary figures use buyer-inclusive totals (hammer + buyer premium) where available;
          hammer is retained for traceability.
        </li>
        <li>
          Non-GBP lots are converted with static demo FX rates for comparison; original currency
          amounts are preserved in the auction history.
        </li>
        <li>
          Medians and 12-month performance use observed sales only. Change is withheld when either
          window has fewer than three transactions. Missing months are not interpolated on bottle
          charts.
        </li>
        <li>
          Auction results are historical market evidence — not guaranteed resale values or
          investment returns.
        </li>
      </ul>
      <Link href="/methodology" className="mt-4 inline-block text-sm font-medium text-ink hover:underline">
        Full methodology →
      </Link>
    </section>
  );
}
