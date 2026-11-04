import {
  filterArticles,
  insightQueryString,
  parseInsightSearchParams,
  type CategoryRoute,
  type InsightFilters,
} from '@/lib/mock/articles';
import type { ArticleCategory } from '@/lib/mock/types';
import { ArticleCard } from '@/components/insights/ArticleCard';
import { CategoryTabs, categoryTabFromCategory } from '@/components/insights/CategoryTabs';
import { InsightsFilters, InsightsPagination } from '@/components/insights/InsightsFilters';

type Search = {
  q?: string;
  topic?: string;
  distillery?: string;
  sort?: string;
  page?: string;
};

export function InsightsListing({
  category,
  searchParams,
  title = 'Latest Insights',
  showTabs = true,
}: {
  category?: ArticleCategory;
  searchParams?: Search;
  title?: string;
  showTabs?: boolean;
}) {
  const basePath = category
    ? `/insights/${category === 'News' ? 'news' : category === 'Guide' ? 'guides' : category === 'Analysis' ? 'analysis' : 'reports'}`
    : '/insights';

  const filters: InsightFilters = {
    ...parseInsightSearchParams(searchParams ?? {}),
    category,
  };
  const { rows, total, page, pageCount } = filterArticles(filters);
  const activeTab = categoryTabFromCategory(category) as CategoryRoute | 'all';
  const querySuffix = insightQueryString({
    q: filters.q,
    topic: filters.topic,
    distillery: filters.distillery,
    sort: filters.sort,
  });

  return (
    <section>
      {showTabs && <CategoryTabs active={activeTab} querySuffix={querySuffix} />}

      <div className="mt-6">
        <InsightsFilters basePath={basePath} filters={filters} />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">{title}</h2>
        <p className="text-sm text-ink-muted">
          {total} article{total === 1 ? '' : 's'}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 border border-line px-4 py-10 text-center text-sm text-ink-muted">
          No articles match these filters.
        </p>
      ) : (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}

      <InsightsPagination
        basePath={basePath}
        filters={filters}
        page={page}
        pageCount={pageCount}
      />
    </section>
  );
}
