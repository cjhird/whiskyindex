import Link from 'next/link';

type ArticleCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readMinutes: number;
};

export function RelatedInsights({ articles }: { articles: ArticleCard[] }) {
  if (!articles.length) return null;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Related insights</h2>
        <Link href="/insights" className="text-sm text-ink-muted hover:text-ink">
          All insights →
        </Link>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/insights/${a.slug}`} className="row-hover block py-4">
              <p className="text-sm text-ink-muted">
                {a.category} · {a.readMinutes} min
              </p>
              <p className="mt-1 text-sm font-medium text-ink">{a.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{a.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
