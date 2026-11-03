'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { bottles } from '@/lib/mock/bottles';

const suggestions = bottles.slice(0, 6);

export function SearchHero() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/screener?q=${encodeURIComponent(query)}` : '/screener');
  }

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,122,69,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(192,41,43,0.05),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
        <p className="animate-fade-up text-[11px] font-medium uppercase tracking-[0.22em] text-ink-faint">
          Secondary auction analytics
        </p>
        <h1 className="animate-fade-up mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl md:text-[3.5rem] md:leading-[1.05]">
          WhiskyIndex
        </h1>
        <p
          className="animate-fade-up mt-4 max-w-xl text-base text-ink-muted sm:text-lg"
          style={{ animationDelay: '80ms' }}
        >
          Marks, comps, and portfolio tracking for rare whisky — built like a terminal, not a
          brochure.
        </p>

        <form
          onSubmit={onSubmit}
          className="animate-fade-up mx-auto mt-10 max-w-3xl"
          style={{ animationDelay: '140ms' }}
        >
          <label className="surface flex items-stretch overflow-hidden rounded-xl">
            <span className="sr-only">Search for any bottle</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Macallan 18, Springbank 15, Yamazaki 12…"
              className="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-ink outline-none placeholder:text-ink-faint sm:text-lg"
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 bg-ink px-5 text-sm font-medium text-white transition hover:bg-black sm:px-8"
            >
              Search
            </button>
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => router.push(`/bottle/${b.slug}`)}
                className="rounded-full border border-line bg-white/70 px-3 py-1 text-xs text-ink-muted transition hover:border-line-strong hover:text-ink"
              >
                {b.name}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
