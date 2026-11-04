import type { Metadata } from 'next';
import Link from 'next/link';
import { StatusChip } from '@/components/ui/StatusChip';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'WhiskyIndex plans for collectors tracking auction marks and portfolios.',
};

type Feature = {
  label: string;
  status: null | 'demo' | 'limited' | 'planned';
};

const plans: {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: Feature[];
  cta: { href: string; label: string };
  emphasized: boolean;
}[] = [
  {
    name: 'Public',
    price: '£0',
    cadence: 'forever',
    blurb: 'Market overview, screener, and insights.',
    features: [
      { label: 'Market board & indices', status: null },
      { label: 'Whisky screener', status: null },
      { label: 'Insights hub', status: null },
      { label: 'Bottle pages', status: 'limited' },
    ],
    cta: { href: '/screener', label: 'Browse market' },
    emphasized: false,
  },
  {
    name: 'Collector',
    price: '£19',
    cadence: '/ month',
    blurb: 'Portfolio marks, watchlists, and deeper comps.',
    features: [
      { label: 'Everything in Public', status: null },
      { label: 'Portfolio tracking', status: 'demo' },
      { label: 'Watchlists & alerts', status: 'planned' },
      { label: 'Full auction history', status: null },
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
      { label: 'Everything in Collector', status: null },
      { label: 'Multi-portfolio workspaces', status: 'planned' },
      { label: 'Export & API', status: 'planned' },
      { label: 'Priority support', status: 'planned' },
    ],
    cta: { href: '/contact', label: 'Talk to us' },
    emphasized: false,
  },
];

function FeatureRow({ feature }: { feature: Feature }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="flex gap-2">
        <span className="text-ink-faint" aria-hidden>
          ·
        </span>
        <span>{feature.label}</span>
      </span>
      {feature.status === 'demo' && <StatusChip tone="demo">Demo</StatusChip>}
      {feature.status === 'limited' && <StatusChip tone="limited">Limited</StatusChip>}
    </li>
  );
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Pricing</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
          Public market data stays open. Member plans unlock portfolio tracking and watchlists.
          This build is a product demo — signup is free and illustrative.
        </p>
      </div>

      <div className="mt-12 divide-y divide-line border-y border-line lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {plans.map((plan) => {
          const available = plan.features.filter((f) => f.status !== 'planned');
          const comingLater = plan.features.filter((f) => f.status === 'planned');

          return (
            <div
              key={plan.name}
              className={
                plan.emphasized
                  ? 'bg-surface-muted/40 px-6 py-8 sm:px-8'
                  : 'px-6 py-8 sm:px-8'
              }
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{plan.name}</p>
                {plan.emphasized && <StatusChip tone="demo">Demo</StatusChip>}
              </div>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-mono-num text-4xl font-semibold tracking-tight text-ink">
                  {plan.price}
                </span>
                <span className="text-sm text-ink-muted">{plan.cadence}</span>
              </p>
              <p className="mt-3 text-sm text-ink-muted">{plan.blurb}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink">
                {available.map((f) => (
                  <FeatureRow key={f.label} feature={f} />
                ))}
              </ul>
              {comingLater.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="label-meta">Coming later</p>
                  <ul className="mt-3 space-y-3 text-sm text-ink-muted">
                    {comingLater.map((f) => (
                      <li key={f.label} className="flex gap-2">
                        <span className="text-ink-faint" aria-hidden>
                          ·
                        </span>
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
          );
        })}
      </div>
    </div>
  );
}
