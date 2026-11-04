import Link from 'next/link';
import type { Author } from '@/lib/mock/types';
import { articlesByAuthor } from '@/lib/mock/articles';

export function AuthorCard({
  author,
  excludeSlug,
}: {
  author: Author;
  excludeSlug?: string;
}) {
  const more = articlesByAuthor(author.id, excludeSlug, 3);

  return (
    <section className="border border-line px-4 py-6 sm:px-6">
      <div className="flex gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center bg-surface-muted font-mono-num text-sm font-semibold text-ink"
          aria-hidden
        >
          {author.name
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{author.name}</p>
          <p className="mt-0.5 text-sm text-ink-muted">{author.role}</p>
          <p className="mt-3 text-sm leading-6 text-ink-muted">{author.bio}</p>
        </div>
      </div>
      {more.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="label-meta">More by {author.name.split(' ')[0]}</p>
          <ul className="mt-2 space-y-2">
            {more.map((a) => (
              <li key={a.slug}>
                <Link href={`/insights/${a.slug}`} className="text-sm text-ink hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
