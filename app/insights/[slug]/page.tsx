import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  CATEGORY_META,
  RESERVED_INSIGHT_SLUGS,
  allArticleSlugs,
  articleHeadings,
  categoryPath,
  formatArticleDateLong,
  getArticle,
  getAuthor,
  relatedArticles,
} from '@/lib/mock/articles';
import { ArticleCover } from '@/components/insights/ArticleCover';
import { ArticleBody } from '@/components/insights/ArticleBody';
import { ArticleToc } from '@/components/insights/ArticleToc';
import { ArticleShare } from '@/components/insights/ArticleShare';
import { AuthorCard } from '@/components/insights/AuthorCard';
import { ArticleCard } from '@/components/insights/ArticleCard';
import { NewsletterSignup } from '@/components/insights/NewsletterSignup';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return allArticleSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  if ((RESERVED_INSIGHT_SLUGS as readonly string[]).includes(params.slug)) {
    return { title: 'Insights' };
  }
  const article = getArticle(params.slug);
  if (!article) return { title: 'Insights' };
  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [getAuthor(article.authorId)?.name].filter(Boolean) as string[],
      tags: article.topics,
    },
  };
}

export default function InsightArticlePage({ params }: Props) {
  if ((RESERVED_INSIGHT_SLUGS as readonly string[]).includes(params.slug)) {
    notFound();
  }
  const article = getArticle(params.slug);
  if (!article) notFound();

  const author = getAuthor(article.authorId);
  const headings = articleHeadings(article);
  const related = relatedArticles(article, 3);
  const catMeta = CATEGORY_META[article.category];
  const showSources = article.sources.length > 0 || article.category !== 'News';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: author
      ? { '@type': 'Person', name: author.name }
      : { '@type': 'Organization', name: 'WhiskyIndex' },
    publisher: { '@type': 'Organization', name: 'WhiskyIndex' },
    articleSection: catMeta.label,
    keywords: article.topics.join(', '),
    mainEntityOfPage: `https://whiskyindex.com/insights/${article.slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Insights', item: 'https://whiskyindex.com/insights' },
      {
        '@type': 'ListItem',
        position: 2,
        name: catMeta.plural,
        item: `https://whiskyindex.com${categoryPath(article.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://whiskyindex.com/insights/${article.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/insights" className="hover:text-ink">
          Insights
        </Link>
        <span className="text-ink-faint" aria-hidden>
          /
        </span>
        <Link href={categoryPath(article.category)} className="hover:text-ink">
          {catMeta.plural}
        </Link>
        <span className="text-ink-faint" aria-hidden>
          /
        </span>
        <span className="text-ink line-clamp-1">{article.title}</span>
      </nav>

      <header className="mx-auto mt-8 max-w-3xl">
        <p className="label-meta">{catMeta.label}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-ink-muted sm:text-lg">{article.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
          {author && <span className="font-medium text-ink">{author.name}</span>}
          <span>{formatArticleDateLong(article.publishedAt)}</span>
          {article.updatedAt && (
            <span>Updated {formatArticleDateLong(article.updatedAt)}</span>
          )}
          <span>{article.readMinutes} min read</span>
        </div>
        {article.topics.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {article.topics.map((t) => (
              <li key={t}>
                <Link
                  href={`/insights?topic=${encodeURIComponent(t)}`}
                  className="rounded-md bg-surface-muted px-2.5 py-1 text-sm text-ink-muted hover:text-ink"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <ArticleShare title={article.title} />
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-4xl">
        <ArticleCover
          cover={article.cover}
          alt={article.coverAlt}
          caption={article.coverCaption}
          size="hero"
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          <ArticleBody article={article} />

          {showSources && (
            <section className="mt-12 border-t border-line pt-8">
              <h2 className="text-sm font-semibold text-ink">Sources & methodology</h2>
              {article.reportingPeriod && (
                <p className="mt-3 text-sm text-ink-muted">
                  Reporting period: {article.reportingPeriod}
                </p>
              )}
              {article.sources.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-muted">
                  {article.sources.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Figures referenced in this article are illustrative auction evidence for product
                  design. See{' '}
                  <Link href="/methodology" className="text-ink hover:underline">
                    methodology
                  </Link>{' '}
                  and{' '}
                  <Link href="/data-sources" className="text-ink hover:underline">
                    data sources
                  </Link>
                  .
                </p>
              )}
              <p className="mt-4 text-sm leading-6 text-ink-faint">
                Auction results are historical market observations — not guaranteed resale values or
                investment advice.
              </p>
              <Link
                href="/methodology"
                className="mt-3 inline-block text-sm font-medium text-ink hover:underline"
              >
                Full methodology →
              </Link>
            </section>
          )}
        </div>

        <aside className="lg:pt-2">
          <div className="lg:sticky lg:top-20">
            <ArticleToc headings={headings} />
          </div>
        </aside>
      </div>

      {author && (
        <div className="mx-auto mt-14 max-w-3xl">
          <AuthorCard author={author} excludeSlug={article.slug} />
        </div>
      )}

      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-5xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Related Insights</h2>
            <Link href={categoryPath(article.category)} className="text-sm text-ink-muted hover:text-ink">
              More {catMeta.plural.toLowerCase()} →
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto mt-14 max-w-3xl space-y-8">
        <NewsletterSignup variant="article" />
        <p className="text-sm text-ink-muted">
          <Link href="/insights" className="hover:text-ink">
            ← Back to Insights
          </Link>
          <span className="text-ink-faint"> · </span>
          <Link href={categoryPath(article.category)} className="hover:text-ink">
            {catMeta.plural}
          </Link>
        </p>
      </div>
    </article>
  );
}
