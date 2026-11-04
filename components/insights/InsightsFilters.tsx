import Link from 'next/link';
import {
  TOPIC_OPTIONS,
  insightQueryString,
  type InsightFilters,
} from '@/lib/mock/articles';

export function InsightsFilters({
  basePath,
  filters,
  topics = [...TOPIC_OPTIONS],
}: {
  basePath: string;
  filters: InsightFilters;
  topics?: string[];
}) {
  const action = basePath;

  return (
    <form action={action} method="get" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="min-w-[12rem] flex-1">
        <span className="label-meta">Search</span>
        <input
          type="search"
          name="q"
          defaultValue={filters.q ?? ''}
          placeholder="Titles, topics, distilleries…"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
        />
      </label>
      <label className="sm:w-44">
        <span className="label-meta">Topic</span>
        <select
          name="topic"
          defaultValue={filters.topic ?? ''}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="sm:w-40">
        <span className="label-meta">Sort</span>
        <select
          name="sort"
          defaultValue={filters.sort ?? 'date_desc'}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
        </select>
      </label>
      {filters.distillery && (
        <input type="hidden" name="distillery" value={filters.distillery} />
      )}
      <button type="submit" className="btn btn-primary sm:mb-0.5">
        Apply
      </button>
      {(filters.q || filters.topic || filters.distillery || filters.sort === 'date_asc') && (
        <Link href={basePath} className="btn btn-ghost sm:mb-0.5">
          Clear
        </Link>
      )}
    </form>
  );
}

export function InsightsPagination({
  basePath,
  filters,
  page,
  pageCount,
}: {
  basePath: string;
  filters: InsightFilters;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const prev = page > 1 ? page - 1 : null;
  const next = page < pageCount ? page + 1 : null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
      <p>
        Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        {prev ? (
          <Link
            href={`${basePath}${insightQueryString({ ...filters, page: prev })}`}
            className="btn btn-ghost"
          >
            Previous
          </Link>
        ) : (
          <span className="btn btn-ghost opacity-40">Previous</span>
        )}
        {next ? (
          <Link
            href={`${basePath}${insightQueryString({ ...filters, page: next })}`}
            className="btn btn-ghost"
          >
            Next
          </Link>
        ) : (
          <span className="btn btn-ghost opacity-40">Next</span>
        )}
      </div>
    </div>
  );
}
