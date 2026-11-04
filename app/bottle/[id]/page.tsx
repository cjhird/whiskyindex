import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bottles, getBottleBySlug } from '@/lib/mock/bottles';
import { getAuctionComps, getOrderBook, getRelatedBottles } from '@/lib/mock/auctions';
import { BottleHeader } from '@/components/bottle/BottleHeader';
import { BottleStats } from '@/components/bottle/BottleStats';
import { AuctionCompsTable } from '@/components/bottle/AuctionCompsTable';
import { DepthPanel } from '@/components/bottle/DepthPanel';
import { PriceChart } from '@/components/ui/PriceChart';
import { ChangeBadge, ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { formatGBP } from '@/lib/format';

type Props = { params: { id: string } };

export function generateStaticParams() {
  return bottles.map((b) => ({ id: b.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const bottle = getBottleBySlug(params.id);
  if (!bottle) return { title: 'Bottle' };
  return {
    title: bottle.name,
    description: `${bottle.name} auction marks, comps, and performance on WhiskyIndex.`,
  };
}

export default function BottlePage({ params }: Props) {
  const bottle = getBottleBySlug(params.id);
  if (!bottle) notFound();

  const comps = getAuctionComps(bottle);
  const depth = getOrderBook(bottle);
  const related = getRelatedBottles(bottle, bottles);
  const avgComp = comps.reduce((s, c) => s + c.total, 0) / Math.max(comps.length, 1);
  const high = Math.max(...comps.map((c) => c.total));
  const low = Math.min(...comps.map((c) => c.total));

  return (
    <div>
      <BottleHeader bottle={bottle} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <DisclaimerBanner />

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <PriceChart history={bottle.history} latestPrice={bottle.latestPrice} />
          <div className="space-y-4">
            <BottleStats bottle={bottle} />
            <DepthPanel bids={depth.bids} asks={depth.asks} />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Mark vs 8-lot avg" value={formatGBP(bottle.latestPrice - avgComp)} signed />
          <Metric label="Comp high" value={formatGBP(high)} />
          <Metric label="Comp low" value={formatGBP(low)} />
          <Metric label="Spread (H-L)" value={formatGBP(high - low)} />
        </div>

        <AuctionCompsTable comps={comps} />

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-ink">Performance</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {[
              { label: '1 day', value: bottle.change1d },
              { label: '1 month', value: bottle.change1m },
              { label: '1 year', value: bottle.change1y },
              { label: '3 years', value: bottle.change3y },
            ].map((row) => (
              <div key={row.label} className="surface-panel rounded-xl px-4 py-4">
                <p className="label-meta">{row.label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <ChangeBadge value={row.value} />
                  <ChangeText value={row.value} className="text-lg font-semibold" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ink">Related bottles</h2>
              <p className="mt-0.5 text-xs text-ink-muted">Around {bottle.brand}</p>
            </div>
            <Link
              href={`/screener?brand=${encodeURIComponent(bottle.brand)}`}
              className="text-xs text-ink-muted hover:text-ink"
            >
              More {bottle.brand} →
            </Link>
          </div>
          <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-4 md:gap-2">
            {related.map((b) => (
              <Link
                key={b.id}
                href={`/bottle/${b.slug}`}
                className="group rounded-xl px-3 py-3 transition hover:bg-surface-muted"
              >
                <p className="truncate text-sm font-medium text-ink group-hover:underline">{b.name}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {b.brand} · {b.region}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono-num text-sm font-medium">{formatGBP(b.latestPrice)}</p>
                    <ChangeText value={b.change1m} className="text-xs" />
                  </div>
                  <Sparkline values={b.sparkline} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  signed,
}: {
  label: string;
  value: string;
  signed?: boolean;
}) {
  const negative = signed && value.trim().startsWith('-');
  const positive = signed && !negative && !value.includes('£0');
  return (
    <div className="rounded-xl px-3 py-3">
      <p className="label-meta">{label}</p>
      <p
        className={`mt-1 font-mono-num text-lg font-semibold ${
          negative ? 'text-down' : positive ? 'text-up' : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
