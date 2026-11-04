import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Methodology' };

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Methodology</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        Indexes are built from monthly windows of closed auction comps, converted to GBP, with
        volume weighting and caps so single lots cannot dominate segment series. Bottle marks use
        observed totals (hammer + buyer premium) where available.
      </p>
      <Link
        href="/insights/how-we-build-bottle-indexes"
        className="mt-8 inline-block text-sm font-medium text-ink hover:underline"
      >
        Deep dive: how we build indexes →
      </Link>
    </div>
  );
}
