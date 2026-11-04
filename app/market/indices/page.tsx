import type { Metadata } from 'next';
import Link from 'next/link';
import { marketIndices } from '@/lib/mock/bottles';
import { ChangeBadge, ChangeText } from '@/components/ui/ChangeBadge';

export const metadata: Metadata = {
  title: 'Market indices',
  description: 'WhiskyIndex segment indexes — Broad, Scotch, Japan, and Rare.',
};

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
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Market indices</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Monthly volume-weighted segment indexes built from closed auction comps.
      </p>

      <ul className="mt-10 divide-y divide-line border-t border-line">
        {marketIndices.map((idx) => (
          <li key={idx.slug} className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">{idx.name}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{idx.description}</p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="font-mono-num text-3xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm sm:justify-end">
                  <span>
                    1D <ChangeBadge value={idx.change1d} size="sm" />
                  </span>
                  <span className="text-ink-muted">
                    1M <ChangeText value={idx.change1m} />
                  </span>
                  <span className="text-ink-muted">
                    1Y <ChangeText value={idx.change1y} />
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
