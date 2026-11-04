import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bottles, getBottleBySlug, slugifyName } from '@/lib/mock/bottles';
import {
  DATA_AS_OF,
  getAuctionHistory,
  getBottleMarketStats,
  getComparableBottles,
  getMonthlyMedians,
  getMonthlyVolume,
  relatedInsightArticles,
} from '@/lib/mock/auctions';
import { articles } from '@/lib/mock/articles';
import { buildScreenerHref } from '@/lib/mock/screener';
import { BottleHeader } from '@/components/bottle/BottleHeader';
import { BottleMarketStats } from '@/components/bottle/BottleMarketStats';
import { BottlePriceHistory } from '@/components/bottle/BottlePriceHistory';
import { TradingActivity } from '@/components/bottle/TradingActivity';
import { AuctionHistory } from '@/components/bottle/AuctionHistory';
import { BottleDetails } from '@/components/bottle/BottleDetails';
import { DistilleryOverview } from '@/components/bottle/DistilleryOverview';
import { ComparableBottles } from '@/components/bottle/ComparableBottles';
import { RelatedInsights } from '@/components/bottle/RelatedInsights';
import { DataTransparency } from '@/components/bottle/DataTransparency';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return bottles.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const bottle = getBottleBySlug(params.slug);
  if (!bottle) return { title: 'Bottle' };
  const title = `${bottle.name} · ${bottle.distillery}`;
  const description = `${bottle.name} auction prices, trading activity, and comps on WhiskyIndex — secondary-market evidence for this exact release.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/bottles/${bottle.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default function BottlePage({ params }: Props) {
  const bottle = getBottleBySlug(params.slug);
  if (!bottle) notFound();

  // Canonical URL for renamed slugs
  if (params.slug !== bottle.slug) {
    // Static generation still resolves via alias; prefer linking to canonical in-page.
  }

  const history = getAuctionHistory(bottle);
  const stats = getBottleMarketStats(bottle, history);
  const volume = getMonthlyVolume(bottle, history);
  const medians = getMonthlyMedians(bottle, history);
  const comparables = getComparableBottles(bottle, bottles, 5);
  const insights = relatedInsightArticles(bottle, articles, 3);
  const screenerHref = buildScreenerHref({
    distillery: [bottle.distillery],
    ...(bottle.ageYears != null
      ? { minAge: bottle.ageYears, maxAge: bottle.ageYears }
      : {}),
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: bottle.name,
    brand: bottle.brand,
    category: bottle.whiskyType,
    description: bottle.description ?? `${bottle.name} auction profile on WhiskyIndex`,
    url: `https://whiskyindex.com/bottles/${bottle.slug}`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Distillery', value: bottle.distillery },
      { '@type': 'PropertyValue', name: 'Region', value: bottle.region },
      { '@type': 'PropertyValue', name: 'Country', value: bottle.country },
      ...(bottle.ageYears != null
        ? [{ '@type': 'PropertyValue', name: 'Age', value: `${bottle.ageYears} years` }]
        : []),
      ...(bottle.vintageYear != null
        ? [{ '@type': 'PropertyValue', name: 'Vintage', value: String(bottle.vintageYear) }]
        : []),
      { '@type': 'PropertyValue', name: 'ABV', value: `${bottle.abv}%` },
      { '@type': 'PropertyValue', name: 'Volume', value: `${bottle.volumeMl} ml` },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BottleHeader bottle={bottle} />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:space-y-16">
        <BottleMarketStats stats={stats} />

        <BottlePriceHistory
          sales={history}
          monthlyMedians={medians}
          asOf={DATA_AS_OF}
          currency="GBP"
        />

        <TradingActivity
          stats={stats}
          volume={volume}
          latestDate={stats.latest?.date ?? null}
        />

        <AuctionHistory sales={history} />

        <BottleDetails bottle={bottle} />

        <DistilleryOverview bottle={bottle} />

        <ComparableBottles bottles={comparables} screenerHref={screenerHref} />

        <RelatedInsights articles={insights} />

        <DataTransparency />

        <p className="text-sm text-ink-faint">
          Looking for another release?{' '}
          <Link href="/screener" className="text-ink-muted hover:text-ink">
            Open the screener
          </Link>{' '}
          or browse{' '}
          <Link
            href={`/distilleries/${slugifyName(bottle.distillery)}`}
            className="text-ink-muted hover:text-ink"
          >
            {bottle.distillery}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
