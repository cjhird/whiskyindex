import type { Metadata } from 'next';
import Link from 'next/link';
import { getPortfolioRows, portfolioSummary } from '@/lib/mock/portfolio';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { formatGBP, formatPct } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function PortfolioPage() {
  const summary = portfolioSummary();
  const rows = getPortfolioRows();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Portfolio</h1>
        <p className="text-xs text-ink-muted">
          {summary.positions} positions · signed in
        </p>
      </div>

      <div className="mb-6">
        <DisclaimerBanner />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mobile-card-list mt-6">
        {rows.map((r) => (
          <Link
            key={r.bottleId}
            href={`/bottle/${r.bottle.slug}`}
            className="surface-panel block rounded-xl p-4"
          >
            <p className="font-medium text-ink">{r.bottle.name}</p>
            <p className="mt-1 text-xs text-ink-muted">
              Bought {r.purchaseDate}
              {r.notes ? ` · ${r.notes}` : ''}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono-num text-lg font-semibold">{formatGBP(r.marketValue)}</p>
                <ChangeText value={r.pnlPct} className="text-xs" />
              </div>
              <div className="text-right text-xs text-ink-muted">
                <p>Qty {r.quantity}</p>
                <p className="font-mono-num">Mark {formatGBP(r.bottle.latestPrice)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="desktop-table-only mt-6 overflow-hidden rounded-xl">
        <div className="data-table-wrap max-h-[70vh]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Position</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Cost</th>
                <th className="text-right">Mark</th>
                <th>Trend</th>
                <th className="text-right">Value</th>
                <th className="text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.bottleId}>
                  <td>
                    <Link href={`/bottle/${r.bottle.slug}`} className="font-medium hover:underline">
                      {r.bottle.name}
                    </Link>
                    <p className="text-xs text-ink-muted">
                      Bought {r.purchaseDate}
                      {r.notes ? ` · ${r.notes}` : ''}
                    </p>
                  </td>
                  <td className="text-right font-mono-num">{r.quantity}</td>
                  <td className="text-right font-mono-num text-ink-muted">
                    {formatGBP(r.purchasePrice)}
                  </td>
                  <td className="text-right font-mono-num">
                    {formatGBP(r.bottle.latestPrice)}
                  </td>
                  <td>
                    <Sparkline values={r.bottle.sparkline} />
                  </td>
                  <td className="text-right font-mono-num font-medium">
                    {formatGBP(r.marketValue)}
                  </td>
                  <td className="text-right">
                    <div className="font-mono-num font-medium">{formatGBP(r.pnl)}</div>
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
    <div className="surface-panel rounded-xl p-4">
      <p className="label-meta">{label}</p>
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
