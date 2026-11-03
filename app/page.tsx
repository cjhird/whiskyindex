import { SearchHero } from '@/components/SearchHero';
import { HomeMarket } from '@/components/HomeMarket';
import Link from 'next/link';
import { articles } from '@/lib/mock/articles';

export default function HomePage() {
  const latest = articles.slice(0, 4);

  return (
    <>
      <SearchHero />
      <HomeMarket />
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-ink">Research</h2>
            <Link href="/blog" className="text-sm text-ink-muted hover:text-ink">
              All notes →
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {latest.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <p className="label-meta shrink-0 sm:w-40">
                    {a.category} · {a.readMinutes} min
                  </p>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-ink group-hover:underline">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted line-clamp-2">{a.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
