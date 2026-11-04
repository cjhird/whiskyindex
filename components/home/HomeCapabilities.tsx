import Link from 'next/link';
import { Search, LineChart, Briefcase } from 'lucide-react';

const capabilities = [
  {
    icon: Search,
    title: 'Research Any Bottle',
    description:
      'Search historical auction results, explore price histories and understand what collectible whiskies actually sell for.',
    href: '/bottles',
    cta: 'Explore Bottles',
  },
  {
    icon: LineChart,
    title: 'Analyse the Market',
    description:
      'Discover trends, compare performance and identify movements across distilleries, regions and individual releases.',
    href: '/screener',
    cta: 'Open Screener',
  },
  {
    icon: Briefcase,
    title: 'Track Your Collection',
    description:
      'Monitor bottles you own against observed auction marks. Sign in when you are ready to save a demo portfolio.',
    href: '/portfolio',
    cta: 'Open Portfolio',
  },
];

export function HomeCapabilities() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
          Everything you need to understand the whisky market
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c.title}>
              <c.icon className="size-5 stroke-[1.75] text-ink" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{c.description}</p>
              <Link href={c.href} className="mt-4 inline-block text-sm font-medium text-ink hover:underline">
                {c.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
