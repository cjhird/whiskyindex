'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { brands, countries, regions, searchBottles } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { Button } from '@/components/ui/Button';
import { Field, SelectField, TextField } from '@/components/ui/Field';
import { formatGBP } from '@/lib/format';

function ScreenerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = searchParams.get('q') ?? '';
  const brand = searchParams.get('brand') ?? '';
  const region = searchParams.get('region') ?? '';
  const country = searchParams.get('country') ?? '';
  const sort = searchParams.get('sort') ?? 'latest_price_desc';
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');

  const rows = useMemo(
    () =>
      searchBottles({
        q: q || undefined,
        brand: brand || undefined,
        region: region || undefined,
        country: country || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
      }),
    [q, brand, region, country, minPrice, maxPrice, sort]
  );

  const activeFilters = [
    q && { key: 'q', label: `Search: ${q}` },
    brand && { key: 'brand', label: brand },
    region && { key: 'region', label: region },
    country && { key: 'country', label: country },
    minPrice && { key: 'min_price', label: `Min £${minPrice}` },
    maxPrice && { key: 'max_price', label: `Max £${maxPrice}` },
  ].filter(Boolean) as { key: string; label: string }[];

  function update(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    router.push(`/screener?${params.toString()}`);
    setFiltersOpen(false);
  }

  function clearKey(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/screener?${params.toString()}`);
  }

  const filterForm = (
    <form
      className="grid gap-3 md:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        update({
          q: String(fd.get('q') || ''),
          brand: String(fd.get('brand') || ''),
          region: String(fd.get('region') || ''),
          country: String(fd.get('country') || ''),
          min_price: String(fd.get('min_price') || ''),
          max_price: String(fd.get('max_price') || ''),
          sort: String(fd.get('sort') || 'latest_price_desc'),
        });
      }}
    >
      <Field label="Search">
        <TextField name="q" defaultValue={q} placeholder="Name or brand" />
      </Field>
      <Field label="Brand">
        <SelectField name="brand" defaultValue={brand}>
          <option value="">All</option>
          {brands().map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectField>
      </Field>
      <Field label="Region">
        <SelectField name="region" defaultValue={region}>
          <option value="">All</option>
          {regions().map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>
      </Field>
      <Field label="Country">
        <SelectField name="country" defaultValue={country}>
          <option value="">All</option>
          {countries().map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
      </Field>
      <Field label="Min £">
        <TextField name="min_price" defaultValue={minPrice ?? ''} type="number" />
      </Field>
      <Field label="Max £">
        <TextField name="max_price" defaultValue={maxPrice ?? ''} type="number" />
      </Field>
      <Field label="Sort" className="md:col-span-2">
        <SelectField name="sort" defaultValue={sort}>
          <option value="latest_price_desc">Price high → low</option>
          <option value="latest_price_asc">Price low → high</option>
          <option value="change1m_desc">1M gainers</option>
          <option value="change1m_asc">1M decliners</option>
          <option value="name_asc">Name A → Z</option>
        </SelectField>
      </Field>
      <div className="flex items-end gap-2 md:col-span-4">
        <Button type="submit" variant="ghost">
          Apply filters
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/screener')}>
          Clear
        </Button>
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Screener</h1>
        <p className="font-mono-num text-xs text-ink-muted">{rows.length} results</p>
      </div>

      <div className="mb-3 md:hidden">
        <Button type="button" variant="ghost" className="w-full" onClick={() => setFiltersOpen((v) => !v)}>
          {filtersOpen ? 'Hide filters' : 'Show filters'}
        </Button>
      </div>

      <div className={`surface-panel mb-4 rounded-xl p-4 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
        {filterForm}
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => clearKey(f.key)}
              className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink-muted hover:bg-[#efeff1] hover:text-ink"
            >
              {f.label} ×
            </button>
          ))}
        </div>
      )}

      <div className="mobile-card-list">
        {rows.map((b) => (
          <Link key={b.id} href={`/bottle/${b.slug}`} className="surface-panel block rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{b.name}</p>
                <p className="mt-1 text-xs font-medium text-ink-muted">
                  {b.brand} · {b.region}
                </p>
              </div>
              <Sparkline values={b.sparkline} />
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="font-mono-num text-lg font-semibold">{formatGBP(b.latestPrice)}</p>
                <p className="text-xs text-ink-muted">
                  1M <ChangeText value={b.change1m} />
                </p>
              </div>
              <p className="font-mono-num text-xs font-medium text-ink-muted">Vol {b.volume30d}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="desktop-table-only overflow-hidden rounded-xl">
        <div className="data-table-wrap max-h-[70vh]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bottle</th>
                <th>Region</th>
                <th>Trend</th>
                <th className="text-right">Mark</th>
                <th className="text-right">1M</th>
                <th className="text-right">1Y</th>
                <th className="text-right">Vol 30D</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/bottle/${b.slug}`} className="font-semibold text-ink hover:underline">
                      {b.name}
                    </Link>
                    <p className="text-xs font-medium text-ink-muted">{b.brand}</p>
                  </td>
                  <td className="text-ink-muted">
                    {b.region}
                    <span className="text-ink-faint"> · {b.country}</span>
                  </td>
                  <td>
                    <Sparkline values={b.sparkline} />
                  </td>
                  <td className="text-right font-mono-num font-semibold">{formatGBP(b.latestPrice)}</td>
                  <td className="text-right">
                    <ChangeText value={b.change1m} />
                  </td>
                  <td className="text-right">
                    <ChangeText value={b.change1y} />
                  </td>
                  <td className="text-right font-mono-num text-ink-muted">{b.volume30d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ScreenerPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="h-64 animate-pulse rounded-lg border border-line bg-surface-muted" />
        </div>
      }
    >
      <ScreenerContent />
    </Suspense>
  );
}
