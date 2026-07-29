import { z } from "zod";

export const searchBottlesParamsSchema = z.object({
  q: z.string().optional(),
  brand: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  sort: z
    .enum(["latest_price_desc", "latest_price_asc", "name_asc", "brand_asc"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export type SearchBottlesParams = z.infer<typeof searchBottlesParamsSchema>;

export const searchBottlesRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  distillery: z.string().nullable(),
  region: z.string(),
  country: z.string(),
  age_years: z.number().int().nullable(),
  abv: z.number().nullable(),
  volume_ml: z.number().int().nullable(),
  release_year: z.number().int().nullable(),
  cask_type: z.string().nullable(),
  bottle_count: z.number().int().nullable(),
  created_at: z.string(),
  latest_price: z.number().nullable(),
  total_count: z.coerce.number().int(),
});

export type SearchBottlesRow = z.infer<typeof searchBottlesRowSchema>;

export const searchBottlesResponseSchema = z.array(searchBottlesRowSchema);

export const bottleSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  distillery: z.string().nullable(),
  region: z.string(),
  country: z.string(),
  age_years: z.number().int().nullable(),
  abv: z.number().nullable(),
  volume_ml: z.number().int().nullable(),
  release_year: z.number().int().nullable(),
  cask_type: z.string().nullable(),
  bottle_count: z.number().int().nullable(),
  created_at: z.string(),
});

export type Bottle = z.infer<typeof bottleSchema>;

export const priceObservationSchema = z.object({
  id: z.string().uuid(),
  bottle_id: z.string().uuid(),
  source: z.string(),
  currency: z.string(),
  hammer_price: z.number(),
  buyer_premium: z.number().nullable(),
  total_price: z.number(),
  observed_at: z.string(),
  lot_id: z.string().nullable(),
});

export type PriceObservation = z.infer<typeof priceObservationSchema>;

export const bottleMetricsSchema = z.object({
  latest_price: z.number().nullable(),
  latest_date: z.string().nullable(),
  change_30d_pct: z.number().nullable(),
  change_90d_pct: z.number().nullable(),
  change_365d_pct: z.number().nullable(),
  num_observations: z.number().int(),
  simple_volatility: z.number().nullable(),
});

export type BottleMetrics = z.infer<typeof bottleMetricsSchema>;
