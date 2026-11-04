import type { Metadata } from 'next';
import Link from 'next/link';
import { marketIndices } from '@/lib/mock/bottles';
import { StatusChip } from '@/components/ui/StatusChip';

export const metadata: Metadata = {
  title: 'Market indices',
  description: 'Planned WhiskyIndex segment benchmarks — methodology pending.',
};

const planned = [
  'WhiskyIndex 100',
  'Scotch Whisky',
  'Japanese Whisky',
  'Speyside',
  'Islay',
  'Macallan',
];

export default function MarketIndicesPage() {
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
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Market indices</h1>
        <StatusChip>Planned</StatusChip>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Proprietary price benchmarks are not yet live. Placeholder WI series below are illustrative
        only and must not be treated as production index prints.
      </p>

      <div className="mt-8 border border-line px-4 py-4 text-sm text-ink-muted">
        <p className="font-medium text-ink">Status: methodology pending</p>
        <p className="mt-2 leading-6">
          We will not publish a market index calculated from simple average auction prices. When a
          defensible construction ships, each index will have its own historical view here.
        </p>
        <Link href="/methodology" className="mt-3 inline-block font-medium text-ink hover:underline">
          Read methodology →
        </Link>
      </div>

      <h2 className="mt-10 text-sm font-semibold text-ink">Planned benchmarks</h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
        {planned.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h2 className="mt-10 text-sm font-semibold text-ink">Illustrative placeholders</h2>
      <ul className="mt-4 divide-y divide-line border-t border-line">
        {marketIndices.map((idx) => (
          <li key={idx.slug} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
            <div>
              <p className="font-medium text-ink">{idx.name}</p>
              <p className="mt-1 max-w-xl text-sm text-ink-muted">{idx.description}</p>
            </div>
            <p className="font-mono-num text-xl font-semibold text-ink-faint">{idx.value.toFixed(1)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-faint">
        Values shown for UI layout only — not genuine index levels.
      </p>
    </div>
  );
}
