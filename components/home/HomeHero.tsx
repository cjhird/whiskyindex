'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { heroPreviewMovers, marketIndexHistory, marketSnapshot } from '@/lib/mock/market';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { IndexMiniChart } from '@/components/home/IndexMiniChart';
import { formatGBP } from '@/lib/format';
import { Button } from '@/components/ui/Button';

export function HomeHero() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const chart = marketIndexHistory(12);
  const movers = heroPreviewMovers(4);
  const idx = marketSnapshot.index;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/screener?q=${encodeURIComponent(query)}` : '/screener');
  }

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-16">
        <div>
          <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl md:text-[3.25rem] md:leading-[1.05]">
            The whisky market, in numbers.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-ink-muted sm:text-lg">
            Explore auction prices, track rare bottles and uncover trends in the global secondary
            whisky market.
          </p>

          <form onSubmit={onSubmit} className="mt-8 max-w-xl">
            <label className="surface-lined flex items-stretch overflow-hidden rounded-xl">
              <span className="sr-only">Search bottles, distilleries, releases</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search bottles, distilleries, releases…"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-ink outline-none placeholder:text-ink-faint"
                autoComplete="off"
              />
              <Button type="submit" variant="ghost" className="m-1.5 rounded-lg px-4">
                Search
              </Button>
            </label>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/market" className="btn btn-primary px-5 py-2.5">
              Explore the Market
            </Link>
            <Link href="/screener" className="btn btn-ghost px-5 py-2.5">
              Open Screener
            </Link>
          </div>
        </div>

        <div className="border border-line bg-white">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="label-meta">WI Broad · 12M</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="font-mono-num text-2xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                <ChangeText value={idx.change1m} className="text-sm" />
              </div>
            </div>
            <p className="text-sm text-ink-muted">{marketSnapshot.updatedLabel}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 border-b border-line px-4 py-3">
            <Stat label="Turnover" value="£18.4m" />
            <Stat label="Bottles sold" value="24.7k" />
            <Stat label="Houses" value="12" />
          </div>

          <IndexMiniChart points={chart} className="px-2 pt-2" />

          <div className="border-t border-line">
            <p className="px-4 pt-3 text-sm font-medium text-ink">Notable moves · 1M</p>
            <ul className="divide-y divide-line">
              {movers.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/bottles/${b.slug}`}
                    className="row-hover flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                      <p className="truncate text-sm text-ink-muted">{b.distillery}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono-num text-sm text-ink">{formatGBP(b.latestPrice)}</p>
                      <ChangeText value={b.change1m} className="text-sm" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-t border-line px-4 py-2 text-xs text-ink-faint">
            {marketSnapshot.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-meta">{label}</p>
      <p className="mt-1 font-mono-num text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
