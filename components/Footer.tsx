import Link from 'next/link';
import { ChartNoAxesCombined } from 'lucide-react';

const groups = [
  {
    title: 'Platform',
    links: [
      { href: '/market', label: 'Market' },
      { href: '/screener', label: 'Screener' },
      { href: '/bottles', label: 'Bottles' },
      { href: '/auctions', label: 'Auctions' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Insights',
    links: [
      { href: '/insights/news', label: 'News' },
      { href: '/insights/guides', label: 'Guides' },
      { href: '/insights/analysis', label: 'Analysis' },
      { href: '/insights/reports', label: 'Market Reports' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/data-sources', label: 'Data Sources' },
      { href: '/methodology', label: 'Methodology' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-0.5">
              <span className="text-base font-semibold leading-none tracking-[-0.03em] text-ink">
                WhiskyIndex
              </span>
              <ChartNoAxesCombined
                aria-hidden
                className="size-3.5 shrink-0 translate-y-px stroke-[1.75] text-ink"
              />
            </Link>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Market intelligence for the secondary whisky market — auction marks, comps, and
              collector analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-semibold text-ink">{g.title}</p>
                <ul className="mt-3 space-y-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-ink-muted hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WhiskyIndex. All rights reserved.</p>
          <Link href="/disclaimer" className="hover:text-ink-muted">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
