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
      <Link href="/blog" className="text-sm text-ink-muted hover:text-ink">
        ← Research
      </Link>
      <p className="label-meta mt-5">
        {article.category} · {article.readMinutes} min read
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-sm text-ink-muted">
        WhiskyIndex Research ·{' '}
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
