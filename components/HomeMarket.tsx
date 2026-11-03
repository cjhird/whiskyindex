'use client';

import Link from 'next/link';
import { useState } from 'react';
import { collections, marketIndices, topMovers } from '@/lib/mock/bottles';
import { ChangeBadge, ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { cn, formatGBP } from '@/lib/format';

export function HomeMarket() {
  const { gainers, losers } = topMovers(6);
  const [tab, setTab] = useState<'gainers' | 'decliners'>('gainers');
  const rows = tab === 'gainers' ? gainers : losers;

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:py-14">
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Market board</h2>
          <Link href="/screener" className="text-sm text-ink-muted hover:text-ink">
            Screener →
          </Link>
        </div>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {marketIndices.map((idx) => (
            <div key={idx.name}>
              <p className="label-meta">{idx.name}</p>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="font-mono-num text-2xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                <ChangeBadge value={idx.change1d} size="sm" />
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                1M <ChangeText value={idx.change1m} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Movers · 1M</h2>
          <div className="flex gap-1 rounded-lg bg-surface-muted p-1">
            {(
              [
                ['gainers', 'Gainers'],
                ['decliners', 'Decliners'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition',
                  tab === id ? 'bg-white text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-line">
          {rows.map((b) => (
            <li key={b.id}>
              <Link
                href={`/bottle/${b.slug}`}
                className="flex items-center gap-3 py-3.5 transition hover:bg-surface-muted/70"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {b.brand} · {b.region}
                  </p>
                </div>
                <Sparkline values={b.sparkline} />
                <div className="w-24 text-right">
                  <p className="font-mono-num text-sm text-ink">{formatGBP(b.latestPrice)}</p>
                  <ChangeText value={b.change1m} className="text-xs" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-[-0.03em] text-ink">Watch collections</h2>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
          {collections.map((c) => (
            <Link key={c.id} href={c.href} className="group block">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium tracking-[-0.02em] text-ink group-hover:underline">{c.name}</h3>
                <ChangeBadge value={c.change1m} size="sm" />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
              <p className="mt-3 font-mono-num text-xs text-ink-muted">{c.count} bottles</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
