'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export function HomeFinalCta() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:pb-24 sm:pt-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
            Research the market. Follow the evidence.
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-muted">
            Browse auction comps, bottle histories, and market activity. WhiskyIndex is a research
            surface for collectors — not investment advice.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/market" className="btn btn-primary px-5 py-2.5">
              Open Market
            </Link>
            <Link href="/screener" className="btn btn-ghost px-5 py-2.5">
              Open Screener
            </Link>
          </div>
        </div>

        <div className="mt-12 max-w-lg border-t border-line pt-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink">Monthly market briefing</p>
            <span className="font-mono-num text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted">
              Planned
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Optional email digest of index closes and notable bottle moves. Nothing is sent in this
            demo.
          </p>
          {done ? (
            <p className="mt-4 text-sm text-ink">Thanks — we&apos;ll keep this illustrative for now.</p>
          ) : (
            <form onSubmit={onSubscribe} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field"
                />
              </label>
              <button type="submit" className="btn btn-ghost px-4 py-2.5">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
