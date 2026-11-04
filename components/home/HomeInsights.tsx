import Link from 'next/link';
import { latestArticles } from '@/lib/mock/articles';
import { cn } from '@/lib/format';

const coverClass: Record<string, string> = {
  slate: 'from-[#e8eaed] to-[#cfd3d8]',
  oak: 'from-[#efe6d8] to-[#d9c7ad]',
  peat: 'from-[#e4ebe6] to-[#c5d4c9]',
  amber: 'from-[#f3e7d6] to-[#e0c49a]',
};

export function HomeInsights() {
  const items = latestArticles(3);

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
            Insights from the whisky market
          </h2>
          <Link href="/insights" className="text-sm font-medium text-ink hover:underline">
            View All Insights →
          </Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {items.map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className="group block">
              <div
                className={cn(
                  'aspect-[16/10] bg-gradient-to-br',
                  coverClass[a.cover] ?? coverClass.slate
                )}
                aria-hidden
              />
              <p className="label-meta mt-4">{a.category}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted line-clamp-2">{a.excerpt}</p>
              <p className="mt-3 text-sm text-ink-faint">
                {new Date(a.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
