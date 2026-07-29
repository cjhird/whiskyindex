"use client";

import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { SearchBottlesRow } from "@whiskyindex/schemas";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@whiskyindex/ui/table";

function formatPrice(price: number | null): string {
  if (price == null) return "—";
  return `${Number(price).toFixed(2)} GBP`;
}

function buildPageUrl(baseParams: URLSearchParams, pageNum: number): string {
  const p = new URLSearchParams(baseParams);
  if (pageNum <= 1) p.delete("page");
  else p.set("page", String(pageNum));
  const q = p.toString();
  return q ? `/screener?${q}` : "/screener";
}

const columns: ColumnDef<SearchBottlesRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/bottle/${row.original.id}`}
        className="font-medium hover:text-whisky"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.brand}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.region}</span>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.country}</span>
    ),
  },
  {
    id: "latest_price",
    header: "Latest price",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatPrice(row.original.latest_price)}
      </span>
    ),
  },
];

function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 5 }).map((__, j) => (
            <TableCell key={j}>
              <div className="h-5 animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(totalCount / pageSize)),
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isEmpty = totalCount === 0 && !isLoading;
  const baseParams = new URLSearchParams(searchParams);
  baseParams.delete("page");

  return (
    <div className="rounded-lg border border-border bg-background">
      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id ?? ("accessorKey" in col ? String(col.accessorKey) : "col")}>
                  {typeof col.header === "string" ? col.header : ""}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows count={10} />
          </TableBody>
        </Table>
      ) : isEmpty ? (
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">No bottles match your filters.</p>
          <Link
            href="/screener"
            className="mt-2 inline-block text-sm text-whisky hover:underline"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="pl-4 first:pl-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => {
                    window.location.assign(`/bottle/${row.original.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pl-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({totalCount} results)
              </p>
              <div className="flex items-center gap-1">
                {page > 1 && (
                  <Link
                    href={buildPageUrl(baseParams, page - 1)}
                    className="rounded border border-border px-3 py-1.5 text-sm hover:bg-muted"
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
                          ? "bg-whisky font-medium text-whisky-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
                {page < totalPages && (
                  <Link
                    href={buildPageUrl(baseParams, page + 1)}
                    className="rounded border border-border px-3 py-1.5 text-sm hover:bg-muted"
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
