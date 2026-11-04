import Link from 'next/link';
import type { Bottle } from '@/lib/mock/types';
import { BottleImage } from '@/components/bottle/BottleImage';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';
import { getBottleMarketStats } from '@/lib/mock/auctions';

export function ComparableBottles({
  bottles,
  screenerHref,
}: {
  bottles: Bottle[];
  screenerHref: string;
}) {
  return (
    <section>
      <div className="section-head flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2>Comparable Bottles</h2>
          <p>Similar distillery, age, vintage, or price range — each links to its own profile.</p>
        </div>
        <Link href={screenerHref} className="text-sm text-ink-muted hover:text-ink">
          Open in screener →
        </Link>
      </div>

      {bottles.length === 0 ? (
        <p className="text-sm text-ink-muted">No close comparables in the demo universe yet.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {bottles.map((b) => {
            const stats = getBottleMarketStats(b);
            return (
              <li key={b.id}>
                <Link
                  href={`/bottles/${b.slug}`}
                  className="row-hover flex items-center gap-4 py-4"
                >
                  <BottleImage bottle={b} size="sm" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                    <p className="truncate text-sm text-ink-muted">
                      {b.distillery} · {b.region}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="label-meta">12M sales</p>
                    <p className="mt-0.5 font-mono-num text-sm text-ink">{stats.sales12m}</p>
                  </div>
                  <div className="w-28 shrink-0 text-right sm:w-32">
                    <p className="font-mono-num text-sm font-semibold text-ink">
                      {formatGBP(b.latestPrice)}
                    </p>
                    {stats.change12mAvailable && stats.change12mPct != null ? (
                      <ChangeText value={stats.change12mPct} className="text-sm" />
                    ) : (
                      <p className="text-sm text-ink-faint">Change n/a</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
