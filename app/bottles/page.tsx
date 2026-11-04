import type { Metadata } from 'next';
import Link from 'next/link';
import { bottles, distilleries, slugifyName } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { formatGBP } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Bottle database',
  description: 'Browse indexed whisky bottles with auction marks and performance.',
};

export default function BottlesPage() {
  const rows = [...bottles].sort((a, b) => a.name.localeCompare(b.name));
  const houses = distilleries();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Bottle database</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {rows.length} indexed bottles · {houses.length} distilleries
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/screener" className="text-ink-muted hover:text-ink">
            Screener →
          </Link>
          <Link href="/auctions" className="text-ink-muted hover:text-ink">
            Auctions →
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold text-ink">Distilleries</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {houses.map((d) => (
            <Link
              key={d.slug}
              href={`/distilleries/${d.slug}`}
              className="text-sm text-ink-muted hover:text-ink"
            >
              {d.name}
              <span className="font-mono-num text-ink-faint"> ({d.count})</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mobile-card-list">
        {rows.map((b) => (
          <Link key={b.id} href={`/bottles/${b.slug}`} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{b.name}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {b.brand} · {b.region}
                </p>
              </div>
              <Sparkline values={b.sparkline} />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <p className="font-mono-num text-lg font-semibold">{formatGBP(b.latestPrice)}</p>
              <ChangeText value={b.change1m} className="text-sm" />
            </div>
          </Link>
        ))}
      </div>

      <div className="desktop-table-only overflow-hidden">
        <div className="data-table-wrap max-h-[70vh]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bottle</th>
                <th>Distillery</th>
                <th>Region</th>
                <th>Trend</th>
                <th className="text-right">Mark</th>
                <th className="text-right">1M</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/bottles/${b.slug}`} className="font-medium text-ink hover:underline">
                      {b.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/distilleries/${slugifyName(b.distillery)}`}
                      className="text-ink-muted hover:text-ink"
                    >
                      {b.distillery}
                    </Link>
                  </td>
                  <td className="text-ink-muted">{b.region}</td>
                  <td>
                    <Sparkline values={b.sparkline} />
                  </td>
                  <td className="text-right font-mono-num font-medium">{formatGBP(b.latestPrice)}</td>
                  <td className="text-right">
                    <ChangeText value={b.change1m} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
