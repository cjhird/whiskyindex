'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bookmark, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { ScreenerFilterPanel } from '@/components/screener/ScreenerFilters';
import { ChangeText } from '@/components/ui/ChangeBadge';
import {
  PRESETS,
  SCREENER_PAGE_SIZE,
  activeFilterChips,
  clearChip,
  filtersToParams,
  parseScreenerParams,
  screenBottles,
  screenerMeta,
  type ScreenerFilters,
} from '@/lib/mock/screener';
import { slugifyName } from '@/lib/mock/bottles';
import { getWatchlistRows } from '@/lib/mock/watchlist';
import { cn, formatGBP } from '@/lib/format';

const SORTS = [
  { id: 'latest_price_desc', label: 'Latest price ↓' },
  { id: 'latest_price_asc', label: 'Latest price ↑' },
  { id: 'median12m_desc', label: '12M median ↓' },
  { id: 'change12m_desc', label: '12M change ↓' },
  { id: 'change12m_asc', label: '12M change ↑' },
  { id: 'sales12m_desc', label: '12M sales ↓' },
  { id: 'last_sold_desc', label: 'Last sold ↓' },
  { id: 'name_asc', label: 'Name A–Z' },
  { id: 'age_desc', label: 'Age ↓' },
];

function ScreenerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const applied = useMemo(() => parseScreenerParams(searchParams), [searchParams]);
  const [draft, setDraft] = useState<ScreenerFilters>(applied);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [watchToast, setWatchToast] = useState<string | null>(null);
  const [localWatch, setLocalWatch] = useState<Set<string>>(() => new Set(getWatchlistRows().map((r) => r.bottleId)));

  useEffect(() => {
    setDraft(applied);
  }, [applied]);

  const result = useMemo(() => screenBottles(applied), [applied]);
  const chips = useMemo(() => activeFilterChips(applied), [applied]);

  function pushFilters(next: ScreenerFilters) {
    const params = filtersToParams(next);
    const qs = params.toString();
    router.push(qs ? `/screener?${qs}` : '/screener');
    setDrawerOpen(false);
  }

  function applyDraft() {
    pushFilters({ ...draft, page: 1 });
  }

  function resetAll() {
    pushFilters({ sort: 'latest_price_desc', page: 1 });
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    pushFilters({ ...applied, q: draft.q, page: 1 });
  }

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    pushFilters({
      ...preset.apply,
      preset: id,
      q: applied.q,
      page: 1,
    });
  }

  function removeChip(key: string) {
    pushFilters(clearChip(applied, key));
  }

  function setSort(sort: string) {
    pushFilters({ ...applied, sort, page: 1 });
  }

  function setPage(page: number) {
    pushFilters({ ...applied, page });
  }

  function toggleWatch(bottleId: string, name: string) {
    if (!user) {
      setWatchToast('Sign in to save bottles to your watchlist.');
      return;
    }
    setLocalWatch((prev) => {
      const next = new Set(prev);
      if (next.has(bottleId)) {
        next.delete(bottleId);
        setWatchToast(`Removed ${name} from watchlist (demo).`);
      } else {
        next.add(bottleId);
        setWatchToast(`Saved ${name} to watchlist (demo).`);
      }
      return next;
    });
  }

  useEffect(() => {
    if (!watchToast) return;
    const t = setTimeout(() => setWatchToast(null), 2800);
    return () => clearTimeout(t);
  }, [watchToast]);

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8">
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Whisky Screener</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted sm:text-base">
          Discover, filter and compare collectible whiskies using historical auction prices and market
          data.
        </p>
      </header>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <form onSubmit={onSearch} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search bottles, distilleries, releases</span>
            <input
              value={draft.q ?? ''}
              onChange={(e) => setDraft({ ...draft, q: e.target.value })}
              placeholder="Search bottles, distilleries, releases…"
              className="field"
            />
          </label>
          <button type="submit" className="btn btn-ghost px-4 py-2.5">
            Search
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span>
            <span className="font-mono-num text-ink">{result.total}</span> bottles match
          </span>
          <label className="flex items-center gap-2">
            <span className="sr-only">Currency</span>
            <select className="field w-auto py-1.5" defaultValue="GBP" disabled title="GBP for this build">
              <option value="GBP">GBP</option>
            </select>
          </label>
          <span className="text-ink-faint">{screenerMeta.periodLabel}</span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            title={p.description}
            onClick={() => applyPreset(p.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition',
              applied.preset === p.id
                ? 'bg-ink text-white'
                : 'bg-surface-muted text-ink-muted hover:text-ink'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {chips.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button key={c.key} type="button" onClick={() => removeChip(c.key)} className="chip">
              {c.label} <X className="size-3.5" aria-hidden />
            </button>
          ))}
          <button type="button" onClick={resetAll} className="text-sm text-ink-muted hover:text-ink">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            'sticky top-[4.5rem] hidden shrink-0 self-start overflow-hidden rounded-lg border border-line bg-white lg:block',
            sidebarCollapsed ? 'w-12' : 'w-72'
          )}
        >
          {sidebarCollapsed ? (
            <button
              type="button"
              className="flex w-full flex-col items-center gap-2 py-4 text-ink-muted hover:text-ink"
              onClick={() => setSidebarCollapsed(false)}
              aria-expanded={false}
              aria-controls="screener-filter-panel"
              title="Show filters"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              <span className="text-[10px] font-medium uppercase tracking-[0.06em]">Filters</span>
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                <p className="text-sm font-medium text-ink">Filters</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs text-ink-muted hover:text-ink"
                    onClick={resetAll}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs text-ink-muted hover:text-ink"
                    onClick={() => setSidebarCollapsed(true)}
                    aria-expanded={true}
                    aria-controls="screener-filter-panel"
                  >
                    Hide
                  </button>
                </div>
              </div>
              <div id="screener-filter-panel">
                <ScreenerFilterPanel
                  draft={draft}
                  setDraft={setDraft}
                  onApply={applyDraft}
                  onReset={resetAll}
                  hideChrome
                  className="max-h-[calc(100vh-8rem)]"
                />
              </div>
            </>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="btn btn-ghost px-3 py-2 lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
            </button>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <label className="flex items-center gap-2 text-ink-muted">
                Sort
                <select
                  className="field w-auto py-1.5"
                  value={applied.sort || 'latest_price_desc'}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <p className="mb-3 text-xs text-ink-faint">{screenerMeta.priceBasis}</p>

          {result.total === 0 ? (
            <div className="border border-line px-6 py-16 text-center">
              <p className="text-base font-medium text-ink">No bottles match these filters</p>
              <p className="mt-2 text-sm text-ink-muted">
                Broaden or remove filters to see more of the universe.
              </p>
              <button type="button" onClick={resetAll} className="btn btn-primary mt-6 px-5 py-2.5">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="mobile-card-list">
                {result.rows.map((b) => (
                  <div key={b.id} className="flex gap-3">
                    <Link href={`/bottles/${b.slug}`} className="min-w-0 flex-1">
                      <p className="font-medium text-ink">{b.name}</p>
                      <p className="mt-1 text-sm text-ink-muted">
                        {b.distillery} · {b.ageYears ? `${b.ageYears}yo` : 'NAS'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="font-mono-num font-semibold">{formatGBP(b.latestPrice)}</span>
                        {b.change12m != null ? (
                          <ChangeText value={b.change12m} />
                        ) : (
                          <span className="text-ink-faint">12M —</span>
                        )}
                        <span className="text-ink-muted">{b.sales12m} sales</span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      aria-label="Watchlist"
                      onClick={() => toggleWatch(b.id, b.name)}
                      className="self-start rounded-md p-2 text-ink-muted hover:bg-surface-hover hover:text-ink"
                    >
                      <Bookmark
                        className={cn('size-4', localWatch.has(b.id) && 'fill-ink text-ink')}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="desktop-table-only overflow-hidden border border-line">
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="w-10" />
                        <th>Bottle</th>
                        <th>Distillery</th>
                        <th>Vintage / Age</th>
                        <th className="text-right" title="Latest buyer-inclusive auction total">
                          Latest price
                        </th>
                        <th className="text-right" title="Median of illustrative 12M price path">
                          12M median
                        </th>
                        <th
                          className="text-right"
                          title={`Shown only when ≥${12} recorded lots`}
                        >
                          12M change
                        </th>
                        <th className="text-right">12M sales</th>
                        <th>Last sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((b) => (
                        <tr key={b.id} className="group">
                          <td>
                            <button
                              type="button"
                              aria-label={`Watch ${b.name}`}
                              onClick={() => toggleWatch(b.id, b.name)}
                              className="rounded p-1 text-ink-muted hover:bg-surface-hover hover:text-ink"
                            >
                              <Bookmark
                                className={cn('size-4', localWatch.has(b.id) && 'fill-ink text-ink')}
                              />
                            </button>
                          </td>
                          <td>
                            <Link
                              href={`/bottles/${b.slug}`}
                              className="inline-flex items-center gap-3 font-medium text-ink hover:underline"
                            >
                              <span
                                className="inline-block size-8 shrink-0 rounded bg-surface-muted"
                                aria-hidden
                                title="Thumbnail placeholder"
                              />
                              <span>
                                {b.name}
                                <span className="mt-0.5 block text-sm font-normal text-ink-muted">
                                  {b.bottler} · {b.volumeMl}ml
                                </span>
                              </span>
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
                          <td className="text-ink-muted">
                            {b.releaseYear ?? '—'}
                            <span className="text-ink-faint"> / </span>
                            {b.ageYears ? `${b.ageYears}yo` : 'NAS'}
                          </td>
                          <td className="text-right font-mono-num font-medium">
                            {formatGBP(b.latestPrice)}
                          </td>
                          <td className="text-right font-mono-num text-ink-muted">
                            {b.median12m != null ? formatGBP(b.median12m) : '—'}
                          </td>
                          <td className="text-right">
                            {b.change12m != null ? (
                              <ChangeText value={b.change12m} />
                            ) : (
                              <span className="text-ink-faint" title="Insufficient comparable lots">
                                —
                              </span>
                            )}
                          </td>
                          <td className="text-right font-mono-num text-ink-muted">{b.sales12m}</td>
                          <td className="font-mono-num text-ink-muted">{b.lastSold ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
                <p>
                  Showing{' '}
                  <span className="font-mono-num text-ink">
                    {(result.page - 1) * SCREENER_PAGE_SIZE + 1}–
                    {Math.min(result.page * SCREENER_PAGE_SIZE, result.total)}
                  </span>{' '}
                  of <span className="font-mono-num text-ink">{result.total}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={result.page <= 1}
                    onClick={() => setPage(result.page - 1)}
                    className="btn btn-ghost px-2.5 py-1.5 disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="font-mono-num text-ink">
                    {result.page} / {result.pageCount}
                  </span>
                  <button
                    type="button"
                    disabled={result.page >= result.pageCount}
                    onClick={() => setPage(result.page + 1)}
                    className="btn btn-ghost px-2.5 py-1.5 disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/30"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-ink">Filters</p>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X className="size-4 text-ink-muted" />
              </button>
            </div>
            <ScreenerFilterPanel
              draft={draft}
              setDraft={setDraft}
              onApply={applyDraft}
              onReset={resetAll}
              hideChrome
              className="min-h-0 flex-1"
            />
            <div className="border-t border-line px-4 py-3">
              <button type="button" onClick={resetAll} className="text-sm text-ink-muted hover:text-ink">
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}

      {watchToast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-ink shadow-sm">
          {watchToast}
          {!user && (
            <>
              {' '}
              <Link href="/login?redirect=/screener" className="font-medium underline-offset-2 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function ScreenerDashboard() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
      }
    >
      <ScreenerInner />
    </Suspense>
  );
}
