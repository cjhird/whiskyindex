import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  auctionHouses,
  getAuctionHouseBySlug,
  houseStats,
  resultsForHouse,
} from '@/lib/mock/auctionHouses';
import { formatGBP } from '@/lib/format';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return auctionHouses.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const house = getAuctionHouseBySlug(params.slug);
  if (!house) return { title: 'Auction house' };
  return {
    title: house.name,
    description: `${house.name} auction comps and house profile on WhiskyIndex — ${house.focus}.`,
    alternates: { canonical: `/auctions/${house.slug}` },
  };
}

export default function AuctionHousePage({ params }: Props) {
  const house = getAuctionHouseBySlug(params.slug);
  if (!house) notFound();

  const stats = houseStats(house.slug);
  const rows = resultsForHouse(house.slug, 24);
  const others = auctionHouses.filter((h) => h.slug !== house.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/auctions" className="hover:text-ink">
          Auctions
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">{house.name}</span>
      </nav>

      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            {house.name}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {house.city}, {house.country}
            {house.founded ? ` · Est. ${house.founded}` : ''}
            {' · '}
            {house.currency}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{house.focus}</p>
          <p className="mt-4 text-sm leading-7 text-ink-muted">{house.summary}</p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-6 sm:grid-cols-4 lg:text-right">
          <div>
            <p className="label-meta">Lots in sample</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">{stats.lots}</p>
          </div>
          <div>
            <p className="label-meta">Sample turnover</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">
              {formatGBP(stats.turnover, { compact: true })}
            </p>
          </div>
          <div>
            <p className="label-meta">Avg lot</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">
              {formatGBP(stats.avgLot)}
            </p>
          </div>
          <div>
            <p className="label-meta">Unique bottles</p>
            <p className="mt-1 font-mono-num text-2xl font-semibold text-ink">
              {stats.uniqueBottles}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">House details</h2>
          <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-ink-muted">Sale cadence</dt>
              <dd className="max-w-sm text-right text-ink">{house.cadence}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-ink-muted">Buyer premium</dt>
              <dd className="max-w-sm text-right text-ink">{house.buyerPremium}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-ink-muted">Latest sale in sample</dt>
              <dd className="font-mono-num text-ink">{stats.latestSale ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-ink-muted">House site</dt>
              <dd>
                <a
                  href={house.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink hover:underline"
                >
                  Visit house →
                </a>
              </dd>
            </div>
          </dl>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-muted">
            {house.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Other houses</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {others.map((h) => (
              <li key={h.slug}>
                <Link
                  href={`/auctions/${h.slug}`}
                  className="row-hover flex items-center justify-between gap-3 py-3"
                >
                  <span className="text-sm font-medium text-ink">{h.name}</span>
                  <span className="text-sm text-ink-muted">{h.city}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Recent lots</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Closed comps attributed to {house.name} in the demo dataset.
            </p>
          </div>
          <Link href="/auctions" className="text-sm text-ink-muted hover:text-ink">
            All auction results →
          </Link>
        </div>

        <div className="mobile-card-list">
          {rows.map((r) => (
            <Link key={r.id} href={`/bottles/${r.bottleSlug}`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{r.bottleName}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {r.date} · Lot {r.lot} · {r.condition}
                  </p>
                </div>
                <p className="font-mono-num text-sm font-semibold">{formatGBP(r.totalGbp)}</p>
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <p className="py-8 text-sm text-ink-muted">No lots in the current demo sample.</p>
          )}
        </div>

        <div className="desktop-table-only">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bottle</th>
                  <th>Lot</th>
                  <th>Condition</th>
                  <th className="text-right">Hammer</th>
                  <th className="text-right">Total (GBP)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap font-mono-num text-ink-muted">{r.date}</td>
                    <td>
                      <Link
                        href={`/bottles/${r.bottleSlug}`}
                        className="font-medium text-ink hover:underline"
                      >
                        {r.bottleName}
                      </Link>
                    </td>
                    <td className="font-mono-num text-ink-muted">{r.lot}</td>
                    <td className="text-ink-muted">{r.condition}</td>
                    <td className="text-right font-mono-num">
                      {r.currency} {r.hammer.toLocaleString('en-GB')}
                    </td>
                    <td className="text-right font-mono-num font-semibold">
                      {formatGBP(r.totalGbp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
