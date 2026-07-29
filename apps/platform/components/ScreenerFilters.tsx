"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@whiskyindex/ui/button";
import { Input } from "@whiskyindex/ui/input";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "latest_price_desc", label: "Price (high to low)" },
  { value: "latest_price_asc", label: "Price (low to high)" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "brand_asc", label: "Brand (A–Z)" },
];

export function ScreenerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const data = new FormData(form);
      const params = new URLSearchParams();
      const q = (data.get("q") as string)?.trim();
      if (q) params.set("q", q);
      const brand = (data.get("brand") as string)?.trim();
      if (brand) params.set("brand", brand);
      const region = (data.get("region") as string)?.trim();
      if (region) params.set("region", region);
      const country = (data.get("country") as string)?.trim();
      if (country) params.set("country", country);
      const min_price = (data.get("min_price") as string)?.trim();
      if (min_price) params.set("min_price", min_price);
      const max_price = (data.get("max_price") as string)?.trim();
      if (max_price) params.set("max_price", max_price);
      const sort = (data.get("sort") as string) || "latest_price_desc";
      params.set("sort", sort);
      params.set("page", "1");
      router.push(`/screener?${params.toString()}`);
    },
    [router]
  );

  const q = searchParams.get("q") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const region = searchParams.get("region") ?? "";
  const country = searchParams.get("country") ?? "";
  const min_price = searchParams.get("min_price") ?? "";
  const max_price = searchParams.get("max_price") ?? "";
  const sort = searchParams.get("sort") ?? "latest_price_desc";

  const filterKey = [q, brand, region, country, min_price, max_price, sort].join("|");

  return (
    <form
      key={filterKey}
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-background p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Input type="search" name="q" placeholder="Search" defaultValue={q} />
        <Input type="text" name="brand" placeholder="Brand" defaultValue={brand} />
        <Input type="text" name="region" placeholder="Region" defaultValue={region} />
        <Input type="text" name="country" placeholder="Country" defaultValue={country} />
        <Input
          type="number"
          name="min_price"
          placeholder="Min price"
          min={0}
          step={1}
          defaultValue={min_price || undefined}
        />
        <Input
          type="number"
          name="max_price"
          placeholder="Max price"
          min={0}
          step={1}
          defaultValue={max_price || undefined}
        />
        <select
          name="sort"
          defaultValue={sort}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit">Apply filters</Button>
        <Button variant="outline" asChild>
          <a href="/screener">Clear</a>
        </Button>
      </div>
    </form>
  );
}
