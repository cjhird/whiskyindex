'use client';

import { useMemo, useState } from 'react';
import type { AuctionComp } from '@/lib/mock/auctions';
import { formatGBP, cn } from '@/lib/format';
import { ExternalLink } from 'lucide-react';

type SortKey = 'date' | 'hammer' | 'total';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

export function AuctionHistory({ sales }: { sales: AuctionComp[] }) {
  const houses = useMemo(
    () => Array.from(new Set(sales.map((s) => s.house))).sort(),
    [sales]
  );
  const [house, setHouse] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [showGbp, setShowGbp] = useState(true);

  const filtered = useMemo(() => {
    const rows = house === 'all' ? [...sales] : sales.filter((s) => s.house === house);
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortKey === 'hammer') cmp = a.hammer - b.hammer;
      else cmp = a.totalGbp - b.totalGbp;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [sales, house, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const slice = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'date' ? 'desc' : 'desc');
    }
    setPage(0);
  }

  function SortBtn({ k, label }: { k: SortKey; label: string }) {
    const active = sortKey === k;
    return (
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className={cn(
          'inline-flex items-center gap-1 hover:text-ink',
          active ? 'text-ink' : 'text-ink-muted'
        )}
      >
        {label}
        {active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </button>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Auction History</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Every recorded sale for this exact release. Totals preserve original currency; GBP shown
            for comparison.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <span className="sr-only">Auction house</span>
            <select
              value={house}
              onChange={(e) => {
                setHouse(e.target.value);
                setPage(0);
              }}
              className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm text-ink"
            >
              <option value="all">All houses</option>
              {houses.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setShowGbp((v) => !v)}
            className="btn btn-ghost"
          >
            {showGbp ? 'Show original' : 'Show GBP'}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="border border-line px-4 py-10 text-center text-sm text-ink-muted">
          No auction lots match this filter.
        </p>
      ) : (
        <>
          <div className="mobile-card-list">
            {slice.map((c) => (
              <div key={c.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{c.house}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {c.date} · Lot {c.lot}
                    </p>
                  </div>
                  <p className="font-mono-num text-sm font-semibold">
                    {showGbp || c.currency === 'GBP'
                      ? formatGBP(c.totalGbp)
                      : `${c.currency} ${c.total.toLocaleString('en-GB')}`}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                  <span>{c.condition}</span>
                  {c.fillLevel && <span>{c.fillLevel}</span>}
                  <span>
                    Hammer{' '}
                    {showGbp && c.currency !== 'GBP'
                      ? formatGBP(Math.round(c.hammer * (c.totalGbp / c.total)))
                      : `${c.currency} ${c.hammer.toLocaleString('en-GB')}`}
                  </span>
                  {c.lotUrl && (
                    <a
                      href={c.lotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ink hover:underline"
                    >
                      Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="desktop-table-only">
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <SortBtn k="date" label="Date" />
                    </th>
                    <th>Auction house</th>
                    <th>Lot</th>
                    <th>Condition</th>
                    <th className="text-right">
                      <SortBtn k="hammer" label="Hammer" />
                    </th>
                    <th className="text-right">Buyer total</th>
                    <th className="text-right">Currency</th>
                    <th className="text-right">
                      <SortBtn k="total" label="GBP" />
                    </th>
                    <th className="text-right">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((c) => (
                    <tr key={c.id}>
                      <td className="whitespace-nowrap font-mono-num text-ink-muted">{c.date}</td>
                      <td className="font-medium text-ink">{c.house}</td>
                      <td className="font-mono-num text-ink-muted">{c.lot}</td>
                      <td className="text-ink-muted">
                        {c.condition}
                        {c.fillLevel ? ` · ${c.fillLevel}` : ''}
                      </td>
                      <td className="text-right font-mono-num">
                        {c.currency} {c.hammer.toLocaleString('en-GB')}
                      </td>
                      <td className="text-right font-mono-num font-medium">
                        {c.currency} {c.total.toLocaleString('en-GB')}
                      </td>
                      <td className="text-right font-mono-num text-ink-muted">{c.currency}</td>
                      <td className="text-right font-mono-num font-semibold">
                        {formatGBP(c.totalGbp)}
                      </td>
                      <td className="text-right">
                        {c.lotUrl ? (
                          <a
                            href={c.lotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
                          >
                            Lot <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-ink-faint">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
            <p>
              Showing {pageSafe * PAGE_SIZE + 1}–
              {Math.min((pageSafe + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pageSafe <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pageSafe >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
