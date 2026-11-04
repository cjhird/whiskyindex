import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/mock/auth';
import { getBottleBySlug } from '@/lib/mock/bottles';
import { getWatchlistRows } from '@/lib/mock/watchlist';
import { AccountGatePreview } from '@/components/AccountGatePreview';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { formatGBP } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Watchlist',
};

type Props = { searchParams?: { add?: string } };

export default function WatchlistPage({ searchParams }: Props) {
  const session = cookies().get(AUTH_COOKIE)?.value;
  const addSlug = searchParams?.add?.trim();
  const addBottle = addSlug ? getBottleBySlug(addSlug) : null;
  const redirectTo = addSlug ? `/watchlist?add=${encodeURIComponent(addSlug)}` : '/watchlist';

  if (!session) {
    return (
      <AccountGatePreview
        title="Watchlist"
        description="Save bottles to follow new auction prints and price moves. Sign in to keep a personal watchlist."
        redirectTo={redirectTo}
        intentNote={
          addBottle ? `Ready to watch: ${addBottle.name}. Sign in to save it.` : undefined
        }
      />
    );
  }

  const rows = getWatchlistRows();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Watchlist</h1>
        <p className="text-sm text-ink-muted">{rows.length} bottles</p>
      </div>
      <p className="mb-8 text-sm text-ink-muted">
        Demo watchlist. Alerts for new lots and price moves ship with live accounts.
      </p>

      {addBottle && (
        <div className="mb-8 border border-line px-4 py-4">
          <p className="text-sm font-semibold text-ink">Watchlist update</p>
          <p className="mt-1 text-sm text-ink-muted">
            {addBottle.name} — toggling from bottle profiles updates the demo session. Open the{' '}
            <Link href={`/bottles/${addBottle.slug}`} className="text-ink hover:underline">
              bottle profile
            </Link>{' '}
            to confirm.
          </p>
        </div>
      )}

      <div className="mobile-card-list">
        {rows.map((r) => (
          <Link key={r.bottleId} href={`/bottles/${r.bottle.slug}`} className="block">
            <p className="font-medium text-ink">{r.bottle.name}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Added {r.addedAt}
              {r.note ? ` · ${r.note}` : ''}
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="font-mono-num text-lg font-semibold">{formatGBP(r.bottle.latestPrice)}</p>
              <ChangeText value={r.bottle.change1m} className="text-sm" />
            </div>
          </Link>
        ))}
      </div>

      <div className="desktop-table-only overflow-hidden">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bottle</th>
                <th>Added</th>
                <th>Note</th>
                <th>Trend</th>
                <th className="text-right">Mark</th>
                <th className="text-right">1M</th>
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
                      {r.bottle.brand} · {r.bottle.region}
                    </p>
                  </td>
                  <td className="font-mono-num text-ink-muted">{r.addedAt}</td>
                  <td className="text-ink-muted">{r.note ?? '—'}</td>
                  <td>
                    <Sparkline values={r.bottle.sparkline} />
                  </td>
                  <td className="text-right font-mono-num font-medium">
                    {formatGBP(r.bottle.latestPrice)}
                  </td>
                  <td className="text-right">
                    <ChangeText value={r.bottle.change1m} />
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
