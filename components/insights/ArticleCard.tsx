import Link from 'next/link';
import type { Article } from '@/lib/mock/types';
import { CATEGORY_META, formatArticleDate } from '@/lib/mock/articles';
import { ArticleCover } from '@/components/insights/ArticleCover';

export function ArticleCard({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block h-full">
      <ArticleCover
        cover={article.cover}
        alt={article.coverAlt}
        size={compact ? 'sm' : 'md'}
        label={CATEGORY_META[article.category].label}
      />
      <p className="label-meta mt-4">
        {CATEGORY_META[article.category].label}
        <span className="text-ink-faint"> · </span>
        {formatArticleDate(article.publishedAt)}
        {!compact && (
          <>
            <span className="text-ink-faint"> · </span>
            {article.readMinutes} min
          </>
        )}
      </p>
      <h3
        className={`mt-2 font-semibold tracking-[-0.02em] text-ink group-hover:underline ${
          compact ? 'text-base' : 'text-lg'
        }`}
      >
        {article.title}
      </h3>
      {!compact && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{article.excerpt}</p>
      )}
    </Link>
  );
}
