import { z } from 'zod';

export const searchBottlesParamsSchema = z.object({
  q: z.string().optional(),
  brand: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  sort: z.enum(['latest_price_desc', 'latest_price_asc', 'name_asc', 'brand_asc']).optional(),
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
