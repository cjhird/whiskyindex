'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AuctionResultRow } from '@/lib/mock/auctions';
import { formatGBP } from '@/lib/format';
import { cn } from '@/lib/format';

const PAGE_SIZE = 20;

type SortKey = 'date' | 'totalGbp' | 'house' | 'bottle';

export function AuctionsDashboard({ rows }: { rows: AuctionResultRow[] }) {
  const houses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.house))).sort((a, b) => a.localeCompare(b)),
    [rows]
  );
  const months = useMemo(
    () => Array.from(new Set(rows.map((r) => r.date.slice(0, 7)))).sort((a, b) => b.localeCompare(a)),
    [rows]
  );

  const [house, setHouse] = useState('all');
  const [month, setMonth] = useState('all');
  const [sort, setSort] = useState<SortKey>('date');
  const [dir, setDir] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = rows;
    if (house !== 'all') list = list.filter((r) => r.house === house);
    if (month !== 'all') list = list.filter((r) => r.date.startsWith(month));
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      if (sort === 'date') cmp = a.date.localeCompare(b.date);
      else if (sort === 'totalGbp') cmp = a.totalGbp - b.totalGbp;
      else if (sort === 'house') cmp = a.house.localeCompare(b.house);
      else cmp = a.bottleName.localeCompare(b.bottleName);
      return dir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [rows, house, month, sort, dir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(next: SortKey) {
    if (sort === next) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSort(next);
      setDir(next === 'bottle' || next === 'house' ? 'asc' : 'desc');
    }
    setPage(1);
  }

  function resetFilters() {
    setHouse('all');
    setMonth('all');
    setSort('date');
    setDir('desc');
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">House</span>
            <select
              className="field w-auto min-w-[10rem] py-1.5"
              value={house}
              onChange={(e) => {
                setHouse(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All houses</option>
              {houses.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Month</span>
            <select
              className="field w-auto min-w-[9rem] py-1.5"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Sort</span>
            <select
              className="field w-auto min-w-[9rem] py-1.5"
              value={`${sort}:${dir}`}
              onChange={(e) => {
                const [s, d] = e.target.value.split(':') as [SortKey, 'asc' | 'desc'];
                setSort(s);
                setDir(d);
                setPage(1);
              }}
            >
              <option value="date:desc">Date · newest</option>
              <option value="date:asc">Date · oldest</option>
              <option value="totalGbp:desc">Total · high</option>
              <option value="totalGbp:asc">Total · low</option>
              <option value="bottle:asc">Bottle · A–Z</option>
              <option value="house:asc">House · A–Z</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-3 text-sm text-ink-muted">
          <span>
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </span>
          {(house !== 'all' || month !== 'all') && (
            <button type="button" onClick={resetFilters} className="text-ink hover:underline">
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mobile-card-list">
        {pageRows.map((r) => (
          <div key={r.id} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href={`/bottles/${r.bottleSlug}`}
                  className="font-medium text-ink hover:underline"
                >
                  {r.bottleName}
                </Link>
                <p className="mt-1 text-sm text-ink-muted">
                  {r.house} · {r.date} · Lot {r.lot}
                </p>
              </div>
              <p className="font-mono-num text-sm font-semibold">{formatGBP(r.totalGbp)}</p>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              {r.condition} · {r.currency} {r.hammer.toLocaleString('en-GB')} hammer
              {r.currency !== 'GBP' ? ` · ${formatGBP(r.totalGbp)} GBP` : ''}
            </p>
            {r.lotUrl && (
              <a
                href={r.lotUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-ink-muted hover:text-ink"
              >
                Lot source →
              </a>
            )}
          </div>
        ))}
        {pageRows.length === 0 && (
          <p className="py-8 text-sm text-ink-muted">No lots match these filters.</p>
        )}
      </div>

      <div className="desktop-table-only overflow-hidden">
        <div className="data-table-wrap max-h-[75vh]">
          <table className="data-table">
            <thead>
              <tr>
                <Th active={sort === 'date'} dir={dir} onClick={() => toggleSort('date')}>
                  Date
                </Th>
                <Th active={sort === 'bottle'} dir={dir} onClick={() => toggleSort('bottle')}>
                  Bottle
                </Th>
                <Th active={sort === 'house'} dir={dir} onClick={() => toggleSort('house')}>
                  House
                </Th>
                <th>Lot</th>
                <th>Condition</th>
                <th className="text-right">Hammer</th>
                <Th
                  active={sort === 'totalGbp'}
                  dir={dir}
                  onClick={() => toggleSort('totalGbp')}
                  className="text-right"
                >
                  Total (GBP)
                </Th>
                <th className="text-right">Source</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap font-mono-num text-ink-muted">{r.date}</td>
                  <td>
                    <Link
                      href={`/bottles/${r.bottleSlug}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {r.bottleName}
                    </Link>
                    <p className="text-sm text-ink-muted">{r.brand}</p>
                  </td>
                  <td className="text-ink-muted">{r.house}</td>
                  <td className="font-mono-num text-ink-muted">{r.lot}</td>
                  <td className="text-ink-muted">{r.condition}</td>
                  <td className="text-right font-mono-num">
                    {r.currency} {r.hammer.toLocaleString('en-GB')}
                  </td>
                  <td className="text-right font-mono-num font-semibold">
                    {formatGBP(r.totalGbp)}
                  </td>
                  <td className="text-right">
                    {r.lotUrl ? (
                      <a
                        href={r.lotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-ink-muted hover:text-ink"
                      >
                        Lot →
                      </a>
                    ) : (
                      <span className="text-sm text-ink-faint">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-ink-muted">
                    No lots match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm text-ink-muted">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost px-3 py-1.5 disabled:opacity-40"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-ghost px-3 py-1.5 disabled:opacity-40"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  active,
  dir,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  dir: 'asc' | 'desc';
  onClick: () => void;
  className?: string;
}) {
  return (
    <th className={className}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1 font-medium',
          active ? 'text-ink' : 'text-ink-muted hover:text-ink'
        )}
      >
        {children}
        {active && <span aria-hidden>{dir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  );
}
