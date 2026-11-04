import Link from 'next/link';
import { CATEGORY_META, type CategoryRoute } from '@/lib/mock/articles';
import type { ArticleCategory } from '@/lib/mock/types';
import { cn } from '@/lib/format';

const TABS: Array<{ href: string; label: string; match: CategoryRoute | 'all' }> = [
  { href: '/insights', label: 'All', match: 'all' },
  { href: '/insights/news', label: 'News', match: 'news' },
  { href: '/insights/guides', label: 'Guides', match: 'guides' },
  { href: '/insights/analysis', label: 'Analysis', match: 'analysis' },
  { href: '/insights/reports', label: 'Market Reports', match: 'reports' },
];

export function CategoryTabs({
  active,
  querySuffix = '',
}: {
  active: CategoryRoute | 'all';
  querySuffix?: string;
}) {
  return (
    <nav aria-label="Insights categories" className="flex flex-wrap gap-1 border-b border-line pb-px">
      {TABS.map((tab) => {
        const href = `${tab.href}${querySuffix}`;
        const isActive = tab.match === active;
        return (
          <Link
            key={tab.match}
            href={href}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'border-ink text-ink'
                : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function categoryTabFromCategory(category?: ArticleCategory): CategoryRoute | 'all' {
  if (!category) return 'all';
  return CATEGORY_META[category].route;
}
