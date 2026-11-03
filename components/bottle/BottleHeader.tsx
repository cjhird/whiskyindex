import Link from 'next/link';
import type { Bottle } from '@/lib/mock/types';
import { ChangeBadge, ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';

export function BottleHeader({ bottle }: { bottle: Bottle }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/screener" className="hover:text-ink">
            Screener
          </Link>
          <span className="text-ink-faint">/</span>
          <Link href={`/screener?brand=${encodeURIComponent(bottle.brand)}`} className="hover:text-ink">
            {bottle.brand}
          </Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">{bottle.name}</span>
        </nav>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              {bottle.name}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {bottle.country} · {bottle.region}
              <span className="text-ink-faint"> · </span>
              {bottle.distillery}
              <span className="text-ink-faint"> · </span>
              {bottle.ageYears ? `${bottle.ageYears}yo` : 'NAS'}
              <span className="text-ink-faint"> · </span>
              {bottle.abv}% ABV
              <span className="text-ink-faint"> · </span>
              {bottle.volumeMl}ml
              <span className="text-ink-faint"> · </span>
              {bottle.caskType}
            </p>
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="label-meta">Last auction mark</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-3 sm:justify-end">
              <p className="font-mono-num text-4xl font-semibold tracking-tight text-ink">
                {formatGBP(bottle.latestPrice)}
              </p>
              <ChangeBadge value={bottle.change1d} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm sm:justify-end">
              <Stat label="1M" value={<ChangeText value={bottle.change1m} />} />
              <Stat label="1Y" value={<ChangeText value={bottle.change1y} />} />
              <Stat label="3Y" value={<ChangeText value={bottle.change3y} />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="label-meta">{label}</span>
      <span className="font-mono-num font-medium">{value}</span>
    </span>
  );
}
