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
  const watched = [...topMovers(4).gainers, ...topMovers(4).losers]
    .filter((b, i, arr) => arr.findIndex((x) => x.id === b.id) === i)
    .slice(0, 6);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/screener?q=${encodeURIComponent(query)}` : '/screener');
  }

  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:pb-10 sm:pt-12">
        <p className="label-caps animate-fade-up">Secondary auction analytics</p>
        <h1 className="animate-fade-up mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl md:text-[3.35rem] md:leading-[1.05]">
          WhiskyIndex
        </h1>
        <p
          className="animate-fade-up mt-3 max-w-xl text-base text-ink-muted sm:text-[1.05rem]"
          style={{ animationDelay: '80ms' }}
        >
          Marks, comps, and portfolio tracking for rare whisky — built like a terminal, not a
          brochure.
        </p>

        <form
          onSubmit={onSubmit}
          className="animate-fade-up mt-7 max-w-3xl"
          style={{ animationDelay: '140ms' }}
        >
          <label className="surface flex items-stretch overflow-hidden rounded-xl border-line-strong shadow-soft">
            <span className="sr-only">Search for any bottle</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Macallan 18, Springbank 15, Yamazaki 12…"
              className="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-ink outline-none placeholder:text-ink-faint sm:text-lg"
              autoComplete="off"
            />
            <Button type="submit" className="m-1.5 rounded-lg px-5 sm:px-7">
              Search
            </Button>
          </label>
        </form>

        <div className="animate-fade-up mt-5" style={{ animationDelay: '180ms' }}>
          <p className="label-caps mb-2.5">Most watched marks</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {watched.map((b) => (
              <Link
                key={b.id}
                href={`/bottle/${b.slug}`}
                className="surface-panel group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition hover:border-line-strong hover:bg-white"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink group-hover:underline">{b.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {b.brand} · {b.region}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono-num text-sm font-semibold text-ink">{formatGBP(b.latestPrice)}</p>
                  <ChangeText value={b.change1m} className="text-xs" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
