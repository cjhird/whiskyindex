import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'How WhiskyIndex builds auction marks, medians, liquidity classes, and currency conversion from closed lots.',
  alternates: { canonical: '/methodology' },
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Methodology</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          WhiskyIndex summarises closed auction lots matched to canonical bottle identities. This
          demo uses illustrative data; the rules below describe how the product treats evidence when
          live coverage ships.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Observation windows</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Bottle statistics use completed sales only. A 12-month window is the trailing year before
          the data as-of date. Months without sales are left blank on bottle charts — we do not
          interpolate a continuous market price between lots.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
          Hammer vs buyer-inclusive total
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Where available we store hammer and buyer premium separately and surface buyer-inclusive
          totals as the primary series, so performance matches what a winning bidder settled. Seller
          commissions are excluded from market prints.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Currency conversion</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Non-GBP lots are converted for comparison using stated FX assumptions on the demo. Original
          currency amounts remain in auction history. Aggregates and GBP columns always use converted
          totals.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Medians and performance</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Twelve-month median is the median buyer-inclusive GBP total across matched single-bottle
          sales in the window. Twelve-month change compares the current median with the prior
          12-month median and is withheld unless both windows have at least three observations.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Liquidity classes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Frequently traded: ≥24 sales in 12 months</li>
          <li>Regularly traded: 8–23 sales</li>
          <li>Infrequently traded: 3–7 sales</li>
          <li>Rarely seen at auction: fewer than 3 sales</li>
        </ul>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Liquidity describes observability at auction — not intrinsic rarity or quality.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Bottle matching</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Lots are matched to a canonical release (vintage, edition, bottling year, size). Different
          vintages and materially different editions stay separate. Multi-bottle lots and gift sets
          are excluded unless normalised.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Limitations</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Auction results are historical market evidence — not guaranteed resale values or forecasts.
          Thin samples widen uncertainty. Planned segment indexes remain methodology-pending and are
          not treated as primary market truth on the dashboard.
        </p>
      </section>

      <p className="text-sm text-ink-muted">
        <Link href="/data-sources" className="font-medium text-ink hover:underline">
          Data sources →
        </Link>
        {' · '}
        <Link href="/insights/how-we-build-bottle-indexes" className="font-medium text-ink hover:underline">
          Index construction note →
        </Link>
      </p>
    </div>
  );
}
