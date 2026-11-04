import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/mock/auth';
import { getBottleBySlug } from '@/lib/mock/bottles';
import { getPortfolioRows, portfolioSummary } from '@/lib/mock/portfolio';
import { AccountGatePreview } from '@/components/AccountGatePreview';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { formatGBP, formatPct } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Portfolio',
};

type Props = { searchParams?: { add?: string } };

export default function PortfolioPage({ searchParams }: Props) {
  const session = cookies().get(AUTH_COOKIE)?.value;
  const addSlug = searchParams?.add?.trim();
  const addBottle = addSlug ? getBottleBySlug(addSlug) : null;
  const redirectTo = addSlug ? `/portfolio?add=${encodeURIComponent(addSlug)}` : '/portfolio';

  if (!session) {
    return (
      <AccountGatePreview
        title="Portfolio"
        description="Track holdings against observed auction marks. Demo portfolio marks appear after you sign in."
        redirectTo={redirectTo}
        intentNote={
          addBottle
            ? `Ready to add: ${addBottle.name}. Sign in to record the holding.`
            : undefined
        }
      />
    );
  }

  const summary = portfolioSummary();
  const rows = getPortfolioRows();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Portfolio</h1>
        <p className="text-sm text-ink-muted">{summary.positions} positions</p>
      </div>
      <div className="mb-8">
        <DisclaimerBanner />
      </div>

      {addBottle && (
        <div className="mb-8 border border-line px-4 py-4">
          <p className="text-sm font-semibold text-ink">Add to portfolio</p>
          <p className="mt-1 text-sm text-ink-muted">
            {addBottle.name} — holding entry UI ships with live accounts. For this demo the bottle is
            noted; open the{' '}
            <Link href={`/bottles/${addBottle.slug}`} className="text-ink hover:underline">
              bottle profile
            </Link>{' '}
            or browse your existing positions below.
          </p>
        </div>
      )}

      <div className="grid gap-6 border-b border-line pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Market value" value={formatGBP(summary.marketValue)} />
        <Metric label="Cost basis" value={formatGBP(summary.cost)} />
        <Metric
          label="Unrealised P&L"
          value={`${formatGBP(summary.pnl)} (${formatPct(summary.pnlPct)})`}
          tone={summary.pnl >= 0 ? 'up' : 'down'}
        />
        <Metric
          label="Est. day P&L"
          value={formatGBP(summary.dayPnl)}
          tone={summary.dayPnl >= 0 ? 'up' : 'down'}
        />
      </div>

      <div className="mobile-card-list mt-8">
        {rows.map((r) => (
          <Link key={r.bottleId} href={`/bottles/${r.bottle.slug}`} className="block">
            <p className="font-medium text-ink">{r.bottle.name}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Bought {r.purchaseDate}
              {r.notes ? ` · ${r.notes}` : ''}
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono-num text-lg font-semibold">{formatGBP(r.marketValue)}</p>
                <ChangeText value={r.pnlPct} className="text-sm" />
              </div>
              <div className="text-right text-sm text-ink-muted">
                <p>Qty {r.quantity}</p>
                <p className="font-mono-num">Mark {formatGBP(r.bottle.latestPrice)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="desktop-table-only mt-8 overflow-hidden">
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
                    <Link href={`/bottles/${r.bottle.slug}`} className="font-medium hover:underline">
                      {r.bottle.name}
                    </Link>
                    <p className="text-sm text-ink-muted">
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
                    <ChangeText value={r.pnlPct} className="text-sm" />
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

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'up' | 'down';
}) {
  return (
    <div>
      <p className="label-meta">{label}</p>
      <p
        className={`mt-1.5 font-mono-num text-xl font-semibold ${
          tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
