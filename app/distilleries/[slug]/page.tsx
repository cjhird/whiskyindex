import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  bottlesForDistillery,
  distilleries,
  getDistilleryBySlug,
} from '@/lib/mock/bottles';
import { getDistilleryProfile } from '@/lib/mock/distilleryProfiles';
import { getAuctionHistory, getBottleMarketStats } from '@/lib/mock/auctions';
import { buildScreenerHref } from '@/lib/mock/screener';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { BottleImage } from '@/components/bottle/BottleImage';
import { formatGBP } from '@/lib/format';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return distilleries().map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const d = getDistilleryBySlug(params.slug);
  if (!d) return { title: 'Distillery' };
  const profile = getDistilleryProfile(params.slug);
  return {
    title: d.name,
    description:
      profile?.summary ??
      `${d.name} bottles and secondary-market auction marks on WhiskyIndex.`,
    alternates: { canonical: `/distilleries/${d.slug}` },
  };
}

export default function DistilleryPage({ params }: Props) {
  const distillery = getDistilleryBySlug(params.slug);
  if (!distillery) notFound();

  const profile = getDistilleryProfile(params.slug);
  const rows = bottlesForDistillery(params.slug);
  const avgMark =
    rows.reduce((s, b) => s + b.latestPrice, 0) / Math.max(rows.length, 1);
  const sales12m = rows.reduce((s, b) => s + getBottleMarketStats(b, getAuctionHistory(b)).sales12m, 0);
  const screenerHref = buildScreenerHref({ distillery: [distillery.name] });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/bottles" className="hover:text-ink">
          Bottles
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">{distillery.name}</span>
      </nav>

      <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            {distillery.name}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {distillery.country} · {distillery.region}
            {profile?.founded ? ` · Founded ${profile.founded}` : ''}
            {profile ? ` · ${profile.status}` : ''}
          </p>
          {profile?.style && <p className="mt-2 text-sm text-ink-muted">{profile.style}</p>}
          <p className="mt-4 text-sm leading-6 text-ink-muted">
            {profile?.summary ??
              `Tracked releases from ${distillery.name} with secondary-market auction marks.`}
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-6 sm:grid-cols-3 lg:text-right">
          <div>
            <p className="label-meta">Tracked releases</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">{rows.length}</p>
          </div>
          <div>
            <p className="label-meta">Avg latest mark</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">
              {formatGBP(avgMark)}
            </p>
          </div>
          <div>
            <p className="label-meta">12M sales (tracked)</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">{sales12m}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href={screenerHref} className="font-medium text-ink hover:underline">
          Open in screener →
        </Link>
        <Link href="/insights" className="text-ink-muted hover:text-ink">
          Related insights →
        </Link>
      </div>

      <h2 className="mt-10 text-sm font-semibold text-ink">Tracked bottles</h2>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {rows.map((b) => {
          const stats = getBottleMarketStats(b);
          return (
            <li key={b.id}>
              <Link href={`/bottles/${b.slug}`} className="row-hover flex items-center gap-4 py-4">
                <BottleImage bottle={b} size="sm" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                  <p className="truncate text-sm text-ink-muted">
                    {b.ageYears ? `${b.ageYears}yo` : 'NAS'} · {b.caskType}
                    {' · '}
                    {stats.sales12m} sales / 12M
                  </p>
                </div>
                <Sparkline values={b.sparkline} />
                <div className="w-24 text-right">
                  <p className="font-mono-num text-sm text-ink">{formatGBP(b.latestPrice)}</p>
                  {stats.change12mAvailable && stats.change12mPct != null ? (
                    <ChangeText value={stats.change12mPct} className="text-sm" />
                  ) : (
                    <ChangeText value={b.change1m} className="text-sm" />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
