'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { brands, countries, regions, searchBottles } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
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
    q && { key: 'q', label: `“${q}”` },
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
      className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-end lg:gap-2"
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
      <label className="min-w-[10rem] flex-1">
        <span className="sr-only">Search</span>
        <TextField name="q" defaultValue={q} placeholder="Search…" />
      </label>
      <label className="w-full sm:w-36">
        <span className="sr-only">Brand</span>
        <SelectField name="brand" defaultValue={brand}>
          <option value="">Brand</option>
          {brands().map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectField>
      </label>
      <label className="w-full sm:w-36">
        <span className="sr-only">Region</span>
        <SelectField name="region" defaultValue={region}>
          <option value="">Region</option>
          {regions().map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>
      </label>
      <label className="w-full sm:w-36">
        <span className="sr-only">Country</span>
        <SelectField name="country" defaultValue={country}>
          <option value="">Country</option>
          {countries().map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
      </label>
      <label className="w-24">
        <span className="sr-only">Min price</span>
        <TextField name="min_price" defaultValue={minPrice ?? ''} type="number" placeholder="Min £" />
      </label>
      <label className="w-24">
        <span className="sr-only">Max price</span>
        <TextField name="max_price" defaultValue={maxPrice ?? ''} type="number" placeholder="Max £" />
      </label>
      <label className="w-full sm:w-44">
        <span className="sr-only">Sort</span>
        <SelectField name="sort" defaultValue={sort}>
          <option value="latest_price_desc">Price high → low</option>
          <option value="latest_price_asc">Price low → high</option>
          <option value="change1m_desc">1M gainers</option>
          <option value="change1m_asc">1M decliners</option>
          <option value="name_asc">Name A → Z</option>
        </SelectField>
      </label>
      <div className="flex gap-2">
        <Button type="submit" variant="ghost">
          Apply
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/screener')}>
          Clear
        </Button>
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-[-0.03em] text-ink">Screener</h1>

      <div className="mb-4 md:hidden">
        <Button type="button" variant="ghost" className="w-full" onClick={() => setFiltersOpen((v) => !v)}>
          {filtersOpen ? 'Hide filters' : 'Filters'}
        </Button>
      </div>

      <div className={`mb-4 ${filtersOpen ? 'block' : 'hidden md:block'}`}>{filterForm}</div>

      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <button key={f.key} type="button" onClick={() => clearKey(f.key)} className="chip">
              {f.label} ×
            </button>
          ))}
        </div>
      )}

      <div className="md:hidden">
        <p className="label-meta mb-2">{rows.length} results</p>
        <div className="mobile-card-list">
          {rows.map((b) => (
            <Link key={b.id} href={`/bottle/${b.slug}`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{b.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {b.brand} · {b.region}
                  </p>
                </div>
                <Sparkline values={b.sparkline} />
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="font-mono-num text-lg font-semibold">{formatGBP(b.latestPrice)}</p>
                  <p className="text-sm text-ink-muted">
                    1M <ChangeText value={b.change1m} />
                  </p>
                </div>
                <p className="font-mono-num text-sm text-ink-muted">Vol {b.volume30d}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="desktop-table-only overflow-hidden">
        <div className="data-table-wrap max-h-[70vh]">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  Bottle <span className="ml-2 font-normal normal-case tracking-normal text-ink-faint">{rows.length}</span>
                </th>
                <th>Region</th>
                <th>Trend</th>
                <th className="text-right">Mark</th>
                <th className="text-right">1M</th>
                <th className="text-right">1Y</th>
                <th className="text-right">Vol</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/bottle/${b.slug}`} className="font-medium text-ink hover:underline">
                      {b.name}
                    </Link>
                    <p className="text-sm text-ink-muted">{b.brand}</p>
                  </td>
                  <td className="text-ink-muted">
                    {b.region}
                    <span className="text-ink-faint"> · {b.country}</span>
                  </td>
                  <td>
                    <Sparkline values={b.sparkline} />
                  </td>
                  <td className="text-right font-mono-num font-medium">{formatGBP(b.latestPrice)}</td>
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
          <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
      }
    >
      <ScreenerContent />
    </Suspense>
  );
}
