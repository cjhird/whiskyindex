import Link from 'next/link';
import type { Article } from '@/lib/mock/types';
import { formatArticleDate } from '@/lib/mock/articles';
import { ArticleCover } from '@/components/insights/ArticleCover';

export function MarketReportFeature({ report }: { report: Article | null }) {
  if (!report) return null;

  const stats = report.blocks.find((b) => b.type === 'stats');

  return (
    <section className="border border-line px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="label-meta">The WhiskyIndex Market Report</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">
            A regular review of auction activity, price movements and emerging trends across the
            collectible whisky market.
          </h2>
          <p className="mt-4 text-sm text-ink-muted">
            Latest: <span className="font-medium text-ink">{report.title}</span>
            {report.reportingPeriod ? (
              <>
                <span className="text-ink-faint"> · </span>
                {report.reportingPeriod}
              </>
            ) : null}
            <span className="text-ink-faint"> · </span>
            {formatArticleDate(report.publishedAt)}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">{report.excerpt}</p>

          {stats && stats.type === 'stats' && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {stats.items.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <dt className="label-meta">{item.label}</dt>
                  <dd className="mt-1 font-mono-num text-lg font-semibold text-ink">{item.value}</dd>
                  {item.note && <p className="mt-0.5 text-sm text-ink-faint">{item.note}</p>}
                </div>
              ))}
            </dl>
          )}

          <Link
            href={`/insights/${report.slug}`}
            className="btn btn-primary mt-6 inline-flex"
          >
            Read the Latest Report
          </Link>
        </div>
        <div className="lg:col-span-5">
          <ArticleCover
            cover={report.cover}
            alt={report.coverAlt}
            size="lg"
            label="Market Report"
          />
        </div>
      </div>
    </section>
  );
}
