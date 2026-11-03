'use client';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { brands, countries, regions, searchBottles } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { formatGBP } from '@/lib/format';

function ScreenerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  function update(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    router.push(`/screener?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Screener</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Free bottle universe with latest auction marks and momentum.
          </p>
        </div>
        <p className="font-mono-num text-xs text-ink-faint">{rows.length} results</p>
      </div>

      <form
        className="surface mb-4 grid gap-3 rounded-lg p-4 md:grid-cols-6"
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
          <input
            name="q"
            defaultValue={q}
            placeholder="Name or brand"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          />
        </Field>
        <Field label="Brand">
          <select
            name="brand"
            defaultValue={brand}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          >
            <option value="">All</option>
            {brands().map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Region">
          <select
            name="region"
            defaultValue={region}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          >
            <option value="">All</option>
            {regions().map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Country">
          <select
            name="country"
            defaultValue={country}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          >
            <option value="">All</option>
            {countries().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Min £">
          <input
            name="min_price"
            defaultValue={minPrice ?? ''}
            type="number"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          />
        </Field>
        <Field label="Max £">
          <input
            name="max_price"
            defaultValue={maxPrice ?? ''}
            type="number"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          />
        </Field>
        <Field label="Sort" className="md:col-span-2">
          <select
            name="sort"
            defaultValue={sort}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-line-strong"
          >
            <option value="latest_price_desc">Price high → low</option>
            <option value="latest_price_asc">Price low → high</option>
            <option value="change1m_desc">1M gainers</option>
            <option value="change1m_asc">1M decliners</option>
            <option value="name_asc">Name A → Z</option>
          </select>
        </Field>
        <div className="flex items-end gap-2 md:col-span-4">
          <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black">
            Apply
          </button>
          <button
            type="button"
            onClick={() => router.push('/screener')}
            className="rounded-md border border-line px-4 py-2 text-sm text-ink-muted hover:text-ink"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="surface overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-accent-soft/70 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Bottle</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Trend</th>
                <th className="px-4 py-3 font-medium text-right">Mark</th>
                <th className="px-4 py-3 font-medium text-right">1M</th>
                <th className="px-4 py-3 font-medium text-right">1Y</th>
                <th className="px-4 py-3 font-medium text-right">Vol 30D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-accent-soft/40">
                  <td className="px-4 py-3">
                    <Link href={`/bottle/${b.slug}`} className="font-medium text-ink hover:underline">
                      {b.name}
                    </Link>
                    <p className="text-xs text-ink-faint">{b.brand}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {b.region}
                    <span className="text-ink-faint"> · {b.country}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline values={b.sparkline} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num font-medium">
                    {formatGBP(b.latestPrice)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChangeText value={b.change1m} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChangeText value={b.change1y} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num text-ink-muted">{b.volume30d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-ink-faint">{label}</span>
      {children}
    </label>
  );
}

export default function ScreenerPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="h-64 animate-pulse rounded-lg bg-white/70" />
        </div>
      }
    >
      <ScreenerContent />
    </Suspense>
  );
}
