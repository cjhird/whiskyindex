import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { articles, getArticle } from '@/lib/mock/articles';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: 'Research' };
  return { title: article.title, description: article.excerpt };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <Link href="/blog" className="text-sm font-semibold text-ink-muted hover:text-ink">
        ← Research
      </Link>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          {article.category}
        </span>
        <span className="text-xs font-medium text-ink-muted">{article.readMinutes} min read</span>
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-sm font-medium text-ink-muted">
        WhiskyIndex Research Desk ·{' '}
        {new Date(article.publishedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <p className="mt-4 text-ink-muted">{article.excerpt}</p>
      <div className="mt-8 space-y-5 border-t border-line pt-8 text-[15px] leading-7 text-ink">
        {article.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </article>
  );
}
