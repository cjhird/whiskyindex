import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  CATEGORY_META,
  featuredArticles,
  latestMarketReport,
} from '@/lib/mock/articles';
import type { ArticleCategory } from '@/lib/mock/types';
import { FeaturedInsights } from '@/components/insights/FeaturedInsights';
import { InsightsListing } from '@/components/insights/InsightsListing';
import { MarketReportFeature } from '@/components/insights/MarketReportFeature';
import { NewsletterSignup } from '@/components/insights/NewsletterSignup';
import { InsightsSupportNav } from '@/components/insights/InsightsSupportNav';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'News, analysis and expert perspectives on the global secondary whisky market from WhiskyIndex.',
  alternates: { canonical: '/insights' },
  openGraph: {
    title: 'Insights · WhiskyIndex',
    description:
      'News, analysis and expert perspectives on the global secondary whisky market.',
    type: 'website',
  },
};

type Props = {
  searchParams?: {
    q?: string;
    topic?: string;
    distillery?: string;
    sort?: string;
    page?: string;
    category?: string;
  };
};

function categoryRedirect(raw?: string): string | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  const aliases: Record<string, ArticleCategory> = {
    news: 'News',
    guide: 'Guide',
    guides: 'Guide',
    analysis: 'Analysis',
    report: 'Market Report',
    reports: 'Market Report',
    'market report': 'Market Report',
    'market-report': 'Market Report',
  };
  const category = aliases[key];
  if (!category) return null;
  return `/insights/${CATEGORY_META[category].route}`;
}

export default function InsightsPage({ searchParams }: Props) {
  const legacy = categoryRedirect(searchParams?.category);
  if (legacy) {
    const params = new URLSearchParams();
    if (searchParams?.q) params.set('q', searchParams.q);
    if (searchParams?.topic) params.set('topic', searchParams.topic);
    if (searchParams?.distillery) params.set('distillery', searchParams.distillery);
    if (searchParams?.sort) params.set('sort', searchParams.sort);
    if (searchParams?.page) params.set('page', searchParams.page);
    const qs = params.toString();
    redirect(qs ? `${legacy}?${qs}` : legacy);
  }

  const featured = featuredArticles();
  const report = latestMarketReport();

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:py-10">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
          Insights
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
          News, analysis and expert perspectives on the global secondary whisky market.
        </p>
      </header>

      <FeaturedInsights primary={featured.primary} secondary={featured.secondary} />

      <InsightsListing searchParams={searchParams} />

      <MarketReportFeature report={report} />

      <NewsletterSignup variant="hub" />

      <InsightsSupportNav />
    </div>
  );
}
