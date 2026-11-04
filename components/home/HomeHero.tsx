'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { marketIndexHistory, marketSnapshot } from '@/lib/mock/market';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { IndexMiniChart } from '@/components/home/IndexMiniChart';
import { Button } from '@/components/ui/Button';

export function HomeHero() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const chart = marketIndexHistory(12);
  const idx = marketSnapshot.index;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/screener?q=${encodeURIComponent(query)}` : '/screener');
  }

  return (
    <section className="flex min-h-[calc(100svh-7.5rem)] border-b border-line bg-white">
      <div className="mx-auto grid w-full max-w-7xl content-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-16">
        <div>
          <p className="text-sm font-semibold tracking-[-0.02em] text-ink">WhiskyIndex</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl md:text-[3.25rem] md:leading-[1.05]">
            The whisky market, in numbers.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-ink-muted sm:text-lg">
            Research closed auction prices, compare rare bottles, and follow secondary-market
            evidence — not forecasts.
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

        <div className="border-y border-line bg-white sm:border sm:border-line">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="label-meta">WI Broad · 12M · illustrative</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="font-mono-num text-2xl font-semibold text-ink">{idx.value.toFixed(1)}</p>
                <ChangeBadge value={idx.change1m} size="sm" />
              </div>
            </div>
            <p className="text-sm text-ink-muted">{marketSnapshot.updatedLabel}</p>
          </div>
          <IndexMiniChart points={chart} className="px-2 py-3" />
        </div>
      </div>
    </section>
  );
}
