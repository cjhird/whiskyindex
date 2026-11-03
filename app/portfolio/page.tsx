import type { Metadata } from 'next';
import Link from 'next/link';
import { getPortfolioRows, portfolioSummary } from '@/lib/mock/portfolio';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { formatGBP, formatPct } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function PortfolioPage() {
  const summary = portfolioSummary();
  const rows = getPortfolioRows();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Portfolio</h1>
          <p className="mt-1 text-sm text-ink-muted">Demo book marked to latest auction totals.</p>
        </div>
        <p className="text-xs text-ink-faint">Signed-in view · mock holdings</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Market value" value={formatGBP(summary.marketValue)} />
        <SummaryCard label="Cost basis" value={formatGBP(summary.cost)} />
        <SummaryCard
          label="Unrealised P&L"
          value={`${formatGBP(summary.pnl)} (${formatPct(summary.pnlPct)})`}
          tone={summary.pnl >= 0 ? 'up' : 'down'}
        />
        <SummaryCard
          label="Est. day P&L"
          value={formatGBP(summary.dayPnl)}
          tone={summary.dayPnl >= 0 ? 'up' : 'down'}
        />
      </div>

      <div className="surface mt-6 overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-accent-soft/70 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium text-right">Qty</th>
                <th className="px-4 py-3 font-medium text-right">Cost</th>
                <th className="px-4 py-3 font-medium text-right">Mark</th>
                <th className="px-4 py-3 font-medium">Trend</th>
                <th className="px-4 py-3 font-medium text-right">Value</th>
                <th className="px-4 py-3 font-medium text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.bottleId} className="hover:bg-accent-soft/40">
                  <td className="px-4 py-3">
                    <Link href={`/bottle/${r.bottle.slug}`} className="font-medium hover:underline">
                      {r.bottle.name}
                    </Link>
                    <p className="text-xs text-ink-faint">
                      Bought {r.purchaseDate}
                      {r.notes ? ` · ${r.notes}` : ''}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num">{r.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono-num text-ink-muted">
                    {formatGBP(r.purchasePrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num">
                    {formatGBP(r.bottle.latestPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline values={r.bottle.sparkline} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num font-medium">
                    {formatGBP(r.marketValue)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-mono-num">{formatGBP(r.pnl)}</div>
                    <ChangeText value={r.pnlPct} className="text-xs" />
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

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'up' | 'down';
}) {
  return (
    <div className="surface rounded-lg p-4">
      <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{label}</p>
      <p
        className={`mt-2 font-mono-num text-xl font-semibold ${
          tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
