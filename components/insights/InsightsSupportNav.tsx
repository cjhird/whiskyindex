import Link from 'next/link';

const links = [
  { href: '/market', label: 'Explore the Market' },
  { href: '/screener', label: 'Discover Bottles' },
  { href: '/auctions', label: 'View Auction Results' },
];

export function InsightsSupportNav() {
  return (
    <nav aria-label="Related WhiskyIndex tools" className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="text-sm text-ink-muted hover:text-ink">
          {l.label} →
        </Link>
      ))}
    </nav>
  );
}
