'use client';

import Link from 'next/link';
import type { SearchBottlesRow } from '@/schemas/bottle';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return `${Number(price).toFixed(2)} GBP`;
}

function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          <td className="py-3 pl-4 pr-2"><div className="h-5 w-32 animate-pulse rounded bg-gray-200" /></td>
          <td className="py-3 px-2"><div className="h-5 w-24 animate-pulse rounded bg-gray-200" /></td>
          <td className="py-3 px-2"><div className="h-5 w-20 animate-pulse rounded bg-gray-200" /></td>
          <td className="py-3 px-2"><div className="h-5 w-20 animate-pulse rounded bg-gray-200" /></td>
          <td className="py-3 pr-4 pl-2"><div className="h-5 w-20 animate-pulse rounded bg-gray-200" /></td>
        </tr>
      ))}
    </>
  );
}

function buildPageUrl(baseParams: URLSearchParams, pageNum: number): string {
  const p = new URLSearchParams(baseParams);
  if (pageNum <= 1) p.delete('page');
  else p.set('page', String(pageNum));
  const q = p.toString();
  return q ? `/screener?${q}` : '/screener';
}

export function ScreenerTable({
  data,
  isLoading,
  totalCount,
  page,
  pageSize,
  searchParams,
}: {
  data: SearchBottlesRow[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  searchParams: URLSearchParams;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasFilters = totalCount === 0 && !isLoading;
  const baseParams = new URLSearchParams(searchParams);
  baseParams.delete('page');

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {isLoading ? (
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 pl-4 pr-2 font-medium text-gray-700">Name</th>
              <th className="py-3 px-2 font-medium text-gray-700">Brand</th>
              <th className="py-3 px-2 font-medium text-gray-700">Region</th>
              <th className="py-3 px-2 font-medium text-gray-700">Country</th>
              <th className="py-3 pr-4 pl-2 font-medium text-gray-700">Latest price</th>
            </tr>
          </thead>
          <tbody>
            <SkeletonRows count={10} />
          </tbody>
        </table>
      ) : hasFilters ? (
        <div className="px-4 py-12 text-center">
          <p className="text-gray-600">No bottles match your filters.</p>
          <a
            href="/screener"
            className="mt-2 inline-block text-sm text-[#ffb347] hover:underline"
          >
            Clear filters
          </a>
        </div>
      ) : (
        <>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 pl-4 pr-2 font-medium text-gray-700">Name</th>
                <th className="py-3 px-2 font-medium text-gray-700">Brand</th>
                <th className="py-3 px-2 font-medium text-gray-700">Region</th>
                <th className="py-3 px-2 font-medium text-gray-700">Country</th>
                <th className="py-3 pr-4 pl-2 font-medium text-gray-700">Latest price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-gray-100 transition hover:bg-gray-50"
                  onClick={() => window.location.assign(`/bottles/${row.id}`)}
                >
                  <td className="py-3 pl-4 pr-2">
                    <Link
                      href={`/bottles/${row.id}`}
                      className="font-medium text-gray-900 hover:text-[#ffb347]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-gray-700">{row.brand}</td>
                  <td className="py-3 px-2 text-gray-700">{row.region}</td>
                  <td className="py-3 px-2 text-gray-700">{row.country}</td>
                  <td className="py-3 pr-4 pl-2 text-gray-700">
                    {formatPrice(row.latest_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages} ({totalCount} results)
              </p>
              <div className="flex items-center gap-1">
                {page > 1 && (
                  <Link
                    href={buildPageUrl(baseParams, page - 1)}
                    className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  const isCurrent = p === page;
                  return (
                    <Link
                      key={p}
                      href={buildPageUrl(baseParams, p)}
                      className={`rounded px-3 py-1.5 text-sm ${
                        isCurrent
                          ? 'bg-[#ffb347] font-medium text-gray-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
                {page < totalPages && (
                  <Link
                    href={buildPageUrl(baseParams, page + 1)}
                    className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
