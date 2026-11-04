import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'WhiskyIndex plans for collectors tracking auction marks and portfolios.',
};

const plans = [
  {
    name: 'Public',
    price: '£0',
    cadence: 'forever',
    blurb: 'Market overview, screener, and insights.',
    features: ['Market board & indices', 'Whisky screener', 'Insights hub', 'Bottle pages (limited)'],
    cta: { href: '/screener', label: 'Browse market' },
    emphasized: false,
  },
  {
    name: 'Collector',
    price: '£19',
    cadence: '/ month',
    blurb: 'Portfolio marks, watchlists, and deeper comps.',
    features: [
      'Everything in Public',
      'Portfolio tracking',
      'Watchlists & alerts (soon)',
      'Full auction history',
    ],
    cta: { href: '/signup', label: 'Start demo' },
    emphasized: true,
  },
  {
    name: 'Pro desk',
    price: '£79',
    cadence: '/ month',
    blurb: 'For advisors and multi-collection desks.',
    features: [
      'Everything in Collector',
      'Multi-portfolio workspaces',
      'Export & API (soon)',
      'Priority support',
    ],
    cta: { href: '/signup', label: 'Talk to us' },
    emphasized: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Pricing</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
          Public market data stays open. Member plans unlock portfolio tracking and watchlists.
          Demo signup is free in this build.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.emphasized
                ? 'border border-ink px-6 py-8'
                : 'border border-line px-6 py-8'
            }
          >
            <p className="label-meta">{plan.name}</p>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-mono-num text-4xl font-semibold tracking-tight text-ink">
                {plan.price}
              </span>
              <span className="text-sm text-ink-muted">{plan.cadence}</span>
            </p>
            <p className="mt-3 text-sm text-ink-muted">{plan.blurb}</p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-ink-faint">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.cta.href}
              className={
                plan.emphasized
                  ? 'btn btn-primary mt-8 w-full py-2.5'
                  : 'btn btn-ghost mt-8 w-full py-2.5'
              }
            >
              {plan.cta.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
