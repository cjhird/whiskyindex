import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  bottlesForDistillery,
  distilleries,
  getDistilleryBySlug,
} from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { formatGBP } from '@/lib/format';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return distilleries().map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const d = getDistilleryBySlug(params.slug);
  if (!d) return { title: 'Distillery' };
  return {
    title: d.name,
    description: `${d.name} bottles and auction marks on WhiskyIndex.`,
  };
}

export default function DistilleryPage({ params }: Props) {
  const distillery = getDistilleryBySlug(params.slug);
  if (!distillery) notFound();

  const rows = bottlesForDistillery(params.slug);
  const avgMark =
    rows.reduce((s, b) => s + b.latestPrice, 0) / Math.max(rows.length, 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/bottles" className="hover:text-ink">
          Bottles
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">{distillery.name}</span>
      </nav>

      <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            {distillery.name}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {distillery.country} · {distillery.region}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-ink-muted">
            Indexed bottles from {distillery.name} with secondary-market auction marks. Open the
            screener to filter the wider universe by brand or region.
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="label-meta">Indexed bottles</p>
          <p className="mt-1 font-mono-num text-3xl font-semibold text-ink">{rows.length}</p>
          <p className="mt-2 text-sm text-ink-muted">
            Avg mark <span className="font-mono-num text-ink">{formatGBP(avgMark)}</span>
          </p>
          <Link
            href={`/screener?distillery=${encodeURIComponent(distillery.name)}`}
            className="mt-4 inline-block text-sm text-ink-muted hover:text-ink"
          >
            Open in screener →
          </Link>
        </div>
      </div>

      <ul className="mt-2 divide-y divide-line">
        {rows.map((b) => (
          <li key={b.id}>
            <Link href={`/bottles/${b.slug}`} className="row-hover flex items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                <p className="truncate text-sm text-ink-muted">
                  {b.ageYears ? `${b.ageYears}yo` : 'NAS'} · {b.caskType}
                </p>
              </div>
              <Sparkline values={b.sparkline} />
              <div className="w-24 text-right">
                <p className="font-mono-num text-sm text-ink">{formatGBP(b.latestPrice)}</p>
                <ChangeText value={b.change1m} className="text-sm" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
