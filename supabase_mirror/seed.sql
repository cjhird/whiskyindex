-- WhiskyIndex demo seed (optional)
-- Run in Supabase SQL Editor when you need test data. Idempotent: safe to run multiple times.
-- Run after schema.sql, rls.sql, and rpcs.sql.

-- Demo bottles (insert or ignore by slug)
insert into public.bottles (slug, name, brand, distillery, region, country, age_years, abv, volume_ml, release_year, cask_type)
values
  ('macallan-18-sherry-oak', 'The Macallan 18 Year Old Sherry Oak', 'Macallan', 'Macallan', 'Speyside', 'Scotland', 18, 43.0, 700, 2022, 'Sherry'),
  ('springbank-15', 'Springbank 15 Year Old', 'Springbank', 'Springbank', 'Campbeltown', 'Scotland', 15, 46.0, 700, 2021, 'Bourbon/Sherry'),
  ('yamazaki-12', 'Yamazaki 12 Year Old', 'Yamazaki', 'Yamazaki', 'Osaka', 'Japan', 12, 43.0, 700, 2023, 'Mizunara'),
  ('hibiki-harmony', 'Hibiki Japanese Harmony', 'Hibiki', 'Yamazaki', 'Osaka', 'Japan', null, 43.0, 700, 2023, 'Blended'),
  ('glenfarclas-25', 'Glenfarclas 25 Year Old', 'Glenfarclas', 'Glenfarclas', 'Speyside', 'Scotland', 25, 43.0, 700, 2020, 'Sherry')
on conflict (slug) do nothing;

-- Generate ~24 monthly price observations per bottle (plausible trend + noise)
-- Idempotent: only insert where no row exists for (bottle_id, source, observed_at)
do $$
declare
  b record;
  i int;
  base_price numeric;
  obs_date date;
  hammer numeric;
  premium numeric;
begin
  for b in select id from public.bottles where slug in (
    'macallan-18-sherry-oak', 'springbank-15', 'yamazaki-12', 'hibiki-harmony', 'glenfarclas-25'
  )
  loop
    base_price := 200 + (random() * 300)::numeric(12,2);
    for i in 0..23 loop
      obs_date := (current_date - (i || ' months')::interval)::date;
      if not exists (select 1 from public.price_observations where price_observations.bottle_id = b.id and source = 'WhiskyAuctioneer' and observed_at = obs_date) then
        hammer := base_price * (1 + (i * 0.01) + (random() * 0.1 - 0.05))::numeric(12,2);
        premium := (hammer * 0.1)::numeric(12,2);
        insert into public.price_observations (bottle_id, source, currency, hammer_price, buyer_premium, observed_at)
        values (b.id, 'WhiskyAuctioneer', 'GBP', hammer, premium, obs_date);
      end if;
    end loop;
  end loop;
end;
$$;

-- Optional: create a demo portfolio for a specific user (replace USER_UUID with your auth.users id after signup)
-- Uncomment and run once you have a user:
/*
insert into public.portfolios (user_id, name)
values ('USER_UUID'::uuid, 'Demo Portfolio')
on conflict (user_id, name) do nothing;

insert into public.portfolio_items (portfolio_id, bottle_id, quantity, purchase_price, purchase_currency, purchase_date)
select p.id, b.id, 1, 250.00, 'GBP', (current_date - interval '6 months')::date
from public.portfolios p
cross join public.bottles b
where p.name = 'Demo Portfolio' and p.user_id = 'USER_UUID'::uuid
  and b.slug in ('macallan-18-sherry-oak', 'springbank-15', 'yamazaki-12')
limit 3
on conflict (portfolio_id, bottle_id) do nothing;
*/
