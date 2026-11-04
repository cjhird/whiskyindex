import Link from 'next/link';
import type { Article } from '@/lib/mock/types';
import { CATEGORY_META, formatArticleDate } from '@/lib/mock/articles';
import { ArticleCover } from '@/components/insights/ArticleCover';

export function FeaturedInsights({
  primary,
  secondary,
}: {
  primary: Article | null;
  secondary: Article[];
}) {
  if (!primary) return null;

  return (
    <section aria-label="Featured insights">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Link href={`/insights/${primary.slug}`} className="group block lg:col-span-7">
          <ArticleCover cover={primary.cover} alt={primary.coverAlt} size="lg" />
          <p className="label-meta mt-4">
            {CATEGORY_META[primary.category].label}
            <span className="text-ink-faint"> · </span>
            {formatArticleDate(primary.publishedAt)}
            <span className="text-ink-faint"> · </span>
            {primary.readMinutes} min
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink group-hover:underline sm:text-3xl">
            {primary.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
            {primary.excerpt}
          </p>
        </Link>

        <div className="flex flex-col gap-8 lg:col-span-5">
          {secondary.map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className="group flex gap-4">
              <ArticleCover
                cover={a.cover}
                alt={a.coverAlt}
                size="sm"
                className="w-32 shrink-0 sm:w-40"
              />
              <div className="min-w-0">
                <p className="label-meta">
                  {CATEGORY_META[a.category].label}
                  <span className="text-ink-faint"> · </span>
                  {formatArticleDate(a.publishedAt)}
                </p>
                <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-ink group-hover:underline sm:text-lg">
                  {a.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
