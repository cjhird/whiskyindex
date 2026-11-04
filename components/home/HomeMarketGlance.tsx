import Link from 'next/link';
import { marketIndexHistory, marketSnapshot } from '@/lib/mock/market';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { IndexMiniChart } from '@/components/home/IndexMiniChart';
import { formatGBP } from '@/lib/format';

export function HomeMarketGlance() {
  const chart = marketIndexHistory(12);
  const idx = marketSnapshot.index;

  const metrics = [
    {
      label: 'Total auction turnover',
      value: formatGBP(marketSnapshot.turnoverGbp, { compact: true }),
      note: marketSnapshot.periodLabel,
    },
    {
      label: 'Total bottles sold',
      value: marketSnapshot.bottlesSold.toLocaleString('en-GB'),
      note: marketSnapshot.periodLabel,
    },
    {
      label: 'WI Broad performance',
      value: idx.value.toFixed(1),
      note: (
        <>
          1M <ChangeText value={idx.change1m} /> · 1Y <ChangeText value={idx.change1y} />
        </>
      ),
    },
    {
      label: 'Auction houses covered',
      value: String(marketSnapshot.housesCovered),
      note: 'Indexed venues',
    },
  ];

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              The whisky market at a glance
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{marketSnapshot.updatedLabel}</p>
          </div>
          <Link href="/market" className="text-sm font-medium text-ink hover:underline">
            Explore Market Data →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="label-meta">{m.label}</p>
              <p className="mt-2 font-mono-num text-2xl font-semibold tracking-tight text-ink">
                {m.value}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{m.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-line">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink">WI Broad · preceding 12 months</p>
              <p className="mt-1 text-sm text-ink-muted">Monthly closes · illustrative series</p>
            </div>
            <Link href="/market/indices" className="text-sm text-ink-muted hover:text-ink">
              All indices →
            </Link>
          </div>
          <IndexMiniChart points={chart} className="px-2 py-3 sm:px-4" />
        </div>

        <p className="mt-4 text-sm text-ink-faint">{marketSnapshot.disclaimer}</p>
      </div>
    </section>
  );
}
