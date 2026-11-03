'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { topMovers } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';
import { Button } from '@/components/ui/Button';

export function SearchHero() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const watched = [...topMovers(3).gainers, ...topMovers(3).losers]
    .filter((b, i, arr) => arr.findIndex((x) => x.id === b.id) === i)
    .slice(0, 5);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/screener?q=${encodeURIComponent(query)}` : '/screener');
  }

  return (
    <section className="relative min-h-[72vh] border-b border-line bg-white">
      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-12 pt-16 sm:min-h-[70vh] sm:pb-16 sm:pt-24">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl md:text-[3.5rem] md:leading-[1.05]">
          WhiskyIndex
        </h1>
        <p className="mt-4 max-w-lg text-base text-ink-muted sm:text-lg">
          Marks, comps, and portfolio tracking for rare whisky.
        </p>

        <form onSubmit={onSubmit} className="mt-8 max-w-2xl">
          <label className="surface-lined flex items-stretch overflow-hidden rounded-xl">
            <span className="sr-only">Search for any bottle</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any bottle…"
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base text-ink outline-none placeholder:text-ink-faint sm:text-lg"
              autoComplete="off"
            />
            <Button type="submit" variant="ghost" className="m-2 rounded-lg px-4 sm:px-6">
              Search
            </Button>
          </label>
        </form>

        <div className="mt-8 max-w-2xl">
          <p className="label-meta mb-2">Most watched</p>
          <ul className="divide-y divide-line">
            {watched.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/bottle/${b.slug}`}
                  className="group row-hover flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink group-hover:underline">{b.name}</p>
                    <p className="truncate text-sm text-ink-muted">
                      {b.brand} · {b.region}
                    </p>
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
      </div>
    </section>
  );
}
