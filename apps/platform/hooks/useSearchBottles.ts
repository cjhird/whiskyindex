"use client";

import { useQuery } from "@tanstack/react-query";
import { searchBottlesMock } from "@whiskyindex/data";
import { createClient } from "@whiskyindex/supabase/browser";
import { shouldUseMockData } from "@whiskyindex/supabase/env";
import {
  searchBottlesParamsSchema,
  searchBottlesResponseSchema,
  type SearchBottlesParams,
  type SearchBottlesRow,
} from "@whiskyindex/schemas";

export function useSearchBottles(params: SearchBottlesParams) {
  const parsed = searchBottlesParamsSchema.parse({
    ...params,
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
  });

  const useMock = shouldUseMockData();

  return useQuery({
    queryKey: ["searchBottles", parsed, useMock],
    queryFn: async (): Promise<SearchBottlesRow[]> => {
      if (useMock) {
        return searchBottlesMock(parsed);
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("search_bottles", {
        q: parsed.q || null,
        brand: parsed.brand || null,
        region: parsed.region || null,
        country: parsed.country || null,
        min_price: parsed.min_price ?? null,
        max_price: parsed.max_price ?? null,
        sort: parsed.sort ?? "latest_price_desc",
        page: parsed.page,
        page_size: parsed.page_size,
      });
      if (error) throw error;
      return searchBottlesResponseSchema.parse(data ?? []);
    },
  });
}
