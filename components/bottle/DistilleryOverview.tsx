import Link from 'next/link';
import type { Bottle } from '@/lib/mock/types';
import { bottlesForDistillery, slugifyName } from '@/lib/mock/bottles';
import { formatGBP } from '@/lib/format';

export function DistilleryOverview({ bottle }: { bottle: Bottle }) {
  const slug = slugifyName(bottle.distillery);
  const peers = bottlesForDistillery(slug);
  const avg =
    peers.reduce((s, b) => s + b.latestPrice, 0) / Math.max(peers.length, 1);

  return (
    <section className="border border-line px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="label-meta">Distillery</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-ink">
            {bottle.distillery}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {bottle.country} · {bottle.region}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
            {peers.length} tracked release{peers.length === 1 ? '' : 's'} from {bottle.distillery}{' '}
            on WhiskyIndex. Average latest auction mark{' '}
            <span className="font-mono-num text-ink">{formatGBP(avg)}</span>.
          </p>
        </div>
        <Link
          href={`/distilleries/${slug}`}
          className="shrink-0 text-sm font-medium text-ink hover:underline"
        >
          Explore {bottle.distillery} →
        </Link>
      </div>
    </section>
  );
}
