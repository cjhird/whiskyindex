'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchBottles } from '@/hooks/useSearchBottles';
import { ScreenerFilters } from '@/components/ScreenerFilters';
import { ScreenerTable } from '@/components/ScreenerTable';
import { searchBottlesParamsSchema } from '@/schemas/bottle';

const DEFAULT_PAGE_SIZE = 20;

function ScreenerContent() {
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const q = searchParams.get('q') ?? undefined;
    const brand = searchParams.get('brand') ?? undefined;
    const region = searchParams.get('region') ?? undefined;
    const country = searchParams.get('country') ?? undefined;
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const sort = (searchParams.get('sort') as 'latest_price_desc' | 'latest_price_asc' | 'name_asc' | 'brand_asc') ?? 'latest_price_desc';
    const page = searchParams.get('page');
    return searchBottlesParamsSchema.parse({
      q: q || undefined,
      brand: brand || undefined,
      region: region || undefined,
      country: country || undefined,
      min_price: min_price != null && min_price !== '' ? Number(min_price) : undefined,
      max_price: max_price != null && max_price !== '' ? Number(max_price) : undefined,
      sort,
      page: page != null && page !== '' ? Number(page) : 1,
      page_size: DEFAULT_PAGE_SIZE,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useSearchBottles(params);

  const rows = data ?? [];
  const totalCount = rows[0]?.total_count ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900">Screener</h1>
      <div className="mt-4 space-y-4">
        <ScreenerFilters />
        {error && (
          <p className="text-sm text-red-600">
            Failed to load bottles. Check your connection and try again.
          </p>
        )}
        <ScreenerTable
          data={rows}
          isLoading={isLoading}
          totalCount={totalCount}
          page={params.page}
          pageSize={params.page_size}
          searchParams={new URLSearchParams(searchParams)}
        />
      </div>
    </div>
  );
}

export default function ScreenerPage() {
  return (
    <Suspense fallback={<ScreenerFallback />}>
      <ScreenerContent />
    </Suspense>
  );
}

function ScreenerFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900">Screener</h1>
      <div className="mt-4 h-64 animate-pulse rounded-lg bg-gray-100" />
    </div>
  );
}
