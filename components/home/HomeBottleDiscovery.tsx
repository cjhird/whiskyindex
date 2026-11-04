'use client';

import Link from 'next/link';
import { useState } from 'react';
import { discoverySets } from '@/lib/mock/market';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { cn, formatGBP } from '@/lib/format';

const tabs = [
  { id: 'performers', label: 'Top Performers' },
  { id: 'traded', label: 'Most Traded' },
  { id: 'declines', label: 'Biggest Declines' },
] as const;

export function HomeBottleDiscovery() {
  const sets = discoverySets();
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('performers');
  const rows =
    tab === 'performers' ? sets.performers : tab === 'traded' ? sets.traded : sets.declines;

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
            Explore the bottles moving the market
          </h2>
          <Link href="/screener" className="text-sm font-medium text-ink hover:underline">
            Explore All Bottles →
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition',
                tab === t.id
                  ? 'bg-surface-muted text-ink'
                  : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden">
          <div className="mobile-card-list">
            {rows.map((r) => (
              <Link key={r.bottle.id} href={`/bottles/${r.bottle.slug}`} className="block">
                <p className="font-medium text-ink">{r.bottle.name}</p>
                <p className="mt-1 text-sm text-ink-muted">{r.bottle.distillery}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="font-mono-num text-lg font-semibold">
                    {formatGBP(r.bottle.latestPrice)}
                  </p>
                  <div className="text-right text-sm">
                    <ChangeText value={r.change} />
                    <p className="text-ink-muted">{r.transactions} txns</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="desktop-table-only">
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bottle</th>
                    <th className="text-right">Latest price</th>
                    <th className="text-right">12M change</th>
                    <th className="text-right">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.bottle.id}>
                      <td>
                        <Link
                          href={`/bottles/${r.bottle.slug}`}
                          className="font-medium text-ink hover:underline"
                        >
                          {r.bottle.name}
                        </Link>
                        <p className="text-sm text-ink-muted">{r.bottle.distillery}</p>
                      </td>
                      <td className="text-right font-mono-num font-medium">
                        {formatGBP(r.bottle.latestPrice)}
                      </td>
                      <td className="text-right">
                        <ChangeText value={r.change} />
                      </td>
                      <td className="text-right font-mono-num text-ink-muted">{r.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
