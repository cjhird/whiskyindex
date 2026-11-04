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

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              {bottle.name}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {bottle.country} · {bottle.region}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span>{bottle.distillery}</span>
              <span>{bottle.ageYears ? `${bottle.ageYears}yo` : 'NAS'}</span>
              <span>{bottle.abv}% ABV</span>
              <span>{bottle.volumeMl}ml</span>
              <span>{bottle.caskType}</span>
            </p>
          </div>

          <div className="surface-panel rounded-2xl p-5">
            <p className="label-meta">Last auction mark</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <p className="font-mono-num text-4xl font-semibold tracking-tight text-ink">
                {formatGBP(bottle.latestPrice)}
              </p>
              <ChangeBadge value={bottle.change1d} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
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
    <div>
      <p className="label-meta">{label}</p>
      <div className="mt-1 font-mono-num font-medium">{value}</div>
    </div>
  );
}
