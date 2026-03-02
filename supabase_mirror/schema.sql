-- WhiskyIndex schema
-- Run this in Supabase SQL Editor first (before rls.sql and rpcs.sql).

-- Bottles (no image_url; data-focused)
create table if not exists public.bottles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  brand text not null,
  distillery text,
  region text not null,
  country text not null,
  age_years int,
  abv numeric(5, 2),
  volume_ml int,
  release_year int,
  cask_type text,
  bottle_count int,
  created_at timestamptz default now(),
  unique (slug)
);

create index if not exists idx_bottles_slug on public.bottles (slug);
create index if not exists idx_bottles_brand on public.bottles (brand);
create index if not exists idx_bottles_region on public.bottles (region);
create index if not exists idx_bottles_country on public.bottles (country);

-- Price observations (total_price = hammer_price + buyer_premium, stored)
create table if not exists public.price_observations (
  id uuid primary key default gen_random_uuid(),
  bottle_id uuid not null references public.bottles (id) on delete cascade,
  source text not null,
  currency text not null default 'GBP',
  hammer_price numeric(12, 2) not null,
  buyer_premium numeric(12, 2),
  total_price numeric(12, 2) generated always as (hammer_price + coalesce(buyer_premium, 0)) stored,
  observed_at date not null,
  lot_id text,
  created_at timestamptz default now()
);

create unique index if not exists idx_price_observations_unique_lot
  on public.price_observations (bottle_id, source, observed_at, coalesce(lot_id, ''));
create index if not exists idx_price_observations_bottle_observed
  on public.price_observations (bottle_id, observed_at desc);

-- Portfolios (user_id = auth.users.id)
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, name)
);

create index if not exists idx_portfolios_user_id on public.portfolios (user_id);

-- Portfolio items
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios (id) on delete cascade,
  bottle_id uuid not null references public.bottles (id) on delete restrict,
  quantity int not null default 1,
  purchase_price numeric(12, 2) not null,
  purchase_currency text not null default 'GBP',
  purchase_date date not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (portfolio_id, bottle_id)
);

create index if not exists idx_portfolio_items_portfolio_id on public.portfolio_items (portfolio_id);
create index if not exists idx_portfolio_items_bottle_id on public.portfolio_items (bottle_id);
