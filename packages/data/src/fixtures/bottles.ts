import type { Bottle, PriceObservation } from "@whiskyindex/schemas";

/** Stable IDs so mock URLs and Supabase seed data stay aligned. */
export const MOCK_BOTTLE_IDS = {
  macallan18: "a0000000-0000-4000-8000-000000000001",
  springbank15: "a0000000-0000-4000-8000-000000000002",
  yamazaki12: "a0000000-0000-4000-8000-000000000003",
  hibiki: "a0000000-0000-4000-8000-000000000004",
  glenfarclas25: "a0000000-0000-4000-8000-000000000005",
} as const;

const CREATED_AT = "2024-01-01T00:00:00.000Z";

export const mockBottles: Bottle[] = [
  {
    id: MOCK_BOTTLE_IDS.macallan18,
    slug: "macallan-18-sherry-oak",
    name: "The Macallan 18 Year Old Sherry Oak",
    brand: "Macallan",
    distillery: "Macallan",
    region: "Speyside",
    country: "Scotland",
    age_years: 18,
    abv: 43.0,
    volume_ml: 700,
    release_year: 2022,
    cask_type: "Sherry",
    bottle_count: null,
    created_at: CREATED_AT,
  },
  {
    id: MOCK_BOTTLE_IDS.springbank15,
    slug: "springbank-15",
    name: "Springbank 15 Year Old",
    brand: "Springbank",
    distillery: "Springbank",
    region: "Campbeltown",
    country: "Scotland",
    age_years: 15,
    abv: 46.0,
    volume_ml: 700,
    release_year: 2021,
    cask_type: "Bourbon/Sherry",
    bottle_count: null,
    created_at: CREATED_AT,
  },
  {
    id: MOCK_BOTTLE_IDS.yamazaki12,
    slug: "yamazaki-12",
    name: "Yamazaki 12 Year Old",
    brand: "Yamazaki",
    distillery: "Yamazaki",
    region: "Osaka",
    country: "Japan",
    age_years: 12,
    abv: 43.0,
    volume_ml: 700,
    release_year: 2023,
    cask_type: "Mizunara",
    bottle_count: null,
    created_at: CREATED_AT,
  },
  {
    id: MOCK_BOTTLE_IDS.hibiki,
    slug: "hibiki-harmony",
    name: "Hibiki Japanese Harmony",
    brand: "Hibiki",
    distillery: "Yamazaki",
    region: "Osaka",
    country: "Japan",
    age_years: null,
    abv: 43.0,
    volume_ml: 700,
    release_year: 2023,
    cask_type: "Blended",
    bottle_count: null,
    created_at: CREATED_AT,
  },
  {
    id: MOCK_BOTTLE_IDS.glenfarclas25,
    slug: "glenfarclas-25",
    name: "Glenfarclas 25 Year Old",
    brand: "Glenfarclas",
    distillery: "Glenfarclas",
    region: "Speyside",
    country: "Scotland",
    age_years: 25,
    abv: 43.0,
    volume_ml: 700,
    release_year: 2020,
    cask_type: "Sherry",
    bottle_count: null,
    created_at: CREATED_AT,
  },
];

function monthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

function deterministicNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildPriceSeries(
  bottleId: string,
  basePrice: number,
  bottleIdx: number,
  months = 24
): PriceObservation[] {
  const observations: PriceObservation[] = [];

  for (let i = 0; i < months; i++) {
    const noise = (deterministicNoise(i + basePrice) - 0.5) * 0.1;
    const hammer = basePrice * (1 + i * 0.01 + noise);
    const premium = hammer * 0.1;
    const observedAt = monthsAgo(i);
    const suffix = `${String(bottleIdx).padStart(4, "0")}${String(i).padStart(8, "0")}`;

    observations.push({
      id: `b0000000-0000-4000-8000-${suffix}`,
      bottle_id: bottleId,
      source: "WhiskyAuctioneer",
      currency: "GBP",
      hammer_price: Math.round(hammer * 100) / 100,
      buyer_premium: Math.round(premium * 100) / 100,
      total_price: Math.round((hammer + premium) * 100) / 100,
      observed_at: observedAt,
      lot_id: null,
    });
  }

  return observations.sort(
    (a, b) => b.observed_at.localeCompare(a.observed_at)
  );
}

export const mockPriceObservations: PriceObservation[] = [
  ...buildPriceSeries(MOCK_BOTTLE_IDS.macallan18, 420, 1),
  ...buildPriceSeries(MOCK_BOTTLE_IDS.springbank15, 280, 2),
  ...buildPriceSeries(MOCK_BOTTLE_IDS.yamazaki12, 350, 3),
  ...buildPriceSeries(MOCK_BOTTLE_IDS.hibiki, 190, 4),
  ...buildPriceSeries(MOCK_BOTTLE_IDS.glenfarclas25, 310, 5),
];
