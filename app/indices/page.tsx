import type { Metadata } from 'next';
import Link from 'next/link';
import { indexProfiles, plannedIndexNames } from '@/lib/mock/indices';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { StatusChip } from '@/components/ui/StatusChip';

export const metadata: Metadata = {
  title: 'Indices',
  description:
    'WhiskyIndex price index family — illustrative WI series and planned segment benchmarks.',
  alternates: { canonical: '/indices' },
};

export default function IndicesHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 text-sm text-ink-muted">
        <Link href="/market" className="hover:text-ink">
          Market
        </Link>
        <span className="text-ink-faint"> / </span>
        <span className="text-ink">Indices</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Indices</h1>
        <StatusChip>Planned</StatusChip>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
        Price benchmarks for the secondary whisky market. Series below are illustrative placeholders
        for product design — not production index prints. Open a series for history and construction
        notes.
      </p>

      <div className="mt-8 border border-line px-4 py-4 text-sm text-ink-muted">
        <p className="font-medium text-ink">Methodology pending</p>
        <p className="mt-2 leading-6">
          WhiskyIndex will not publish a market index calculated from simple average auction prices.
          When a defensible construction ships, each series will keep its own historical view and
          constituent rules here.
        </p>
        <Link href="/methodology" className="mt-3 inline-block font-medium text-ink hover:underline">
          Read methodology →
        </Link>
      </div>

      <h2 className="mt-12 text-sm font-semibold text-ink">Illustrative series</h2>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {indexProfiles.map((idx) => (
          <li key={idx.slug}>
            <Link
              href={`/indices/${idx.slug}`}
              className="row-hover flex flex-wrap items-baseline justify-between gap-4 py-4"
            >
              <div className="min-w-0 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{idx.name}</p>
                  <span className="text-sm text-ink-faint">{idx.category}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{idx.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono-num text-2xl font-semibold text-ink">
                  {idx.value.toFixed(1)}
                </p>
                <ChangeBadge value={idx.change1m} size="sm" />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-sm font-semibold text-ink">Also planned</h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
        {plannedIndexNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
