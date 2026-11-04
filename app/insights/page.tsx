import type { Metadata } from 'next';
import {
  featuredArticles,
  latestMarketReport,
} from '@/lib/mock/articles';
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
  };
};

export default function InsightsPage({ searchParams }: Props) {
  const featured = featuredArticles();
  const report = latestMarketReport();

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:space-y-16 sm:py-12">
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
