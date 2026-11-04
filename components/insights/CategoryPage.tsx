import type { Metadata } from 'next';
import { CATEGORY_META } from '@/lib/mock/articles';
import type { ArticleCategory } from '@/lib/mock/types';
import { InsightsListing } from '@/components/insights/InsightsListing';
import { InsightsSupportNav } from '@/components/insights/InsightsSupportNav';

type Search = {
  q?: string;
  topic?: string;
  distillery?: string;
  sort?: string;
  page?: string;
};

export function categoryMetadata(category: ArticleCategory): Metadata {
  const meta = CATEGORY_META[category];
  return {
    title: meta.plural,
    description: meta.description,
    alternates: { canonical: `/insights/${meta.route}` },
    openGraph: {
      title: `${meta.plural} · WhiskyIndex Insights`,
      description: meta.description,
      type: 'website',
    },
  };
}

export function CategoryPage({
  category,
  searchParams,
}: {
  category: ArticleCategory;
  searchParams?: Search;
}) {
  const meta = CATEGORY_META[category];
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:py-12">
      <header className="max-w-2xl">
        <p className="label-meta">Insights</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
          {meta.plural}
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">{meta.description}</p>
      </header>

      <InsightsListing
        category={category}
        searchParams={searchParams}
        title={`${meta.plural}`}
      />

      <InsightsSupportNav />
    </div>
  );
}
