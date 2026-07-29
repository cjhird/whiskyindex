-- Demo seed data (IDs align with packages/data mock fixtures)

insert into public.bottles (id, slug, name, brand, distillery, region, country, age_years, abv, volume_ml, release_year, cask_type)
values
  ('a0000000-0000-4000-8000-000000000001', 'macallan-18-sherry-oak', 'The Macallan 18 Year Old Sherry Oak', 'Macallan', 'Macallan', 'Speyside', 'Scotland', 18, 43.0, 700, 2022, 'Sherry'),
  ('a0000000-0000-4000-8000-000000000002', 'springbank-15', 'Springbank 15 Year Old', 'Springbank', 'Springbank', 'Campbeltown', 'Scotland', 15, 46.0, 700, 2021, 'Bourbon/Sherry'),
  ('a0000000-0000-4000-8000-000000000003', 'yamazaki-12', 'Yamazaki 12 Year Old', 'Yamazaki', 'Yamazaki', 'Osaka', 'Japan', 12, 43.0, 700, 2023, 'Mizunara'),
  ('a0000000-0000-4000-8000-000000000004', 'hibiki-harmony', 'Hibiki Japanese Harmony', 'Hibiki', 'Yamazaki', 'Osaka', 'Japan', null, 43.0, 700, 2023, 'Blended'),
  ('a0000000-0000-4000-8000-000000000005', 'glenfarclas-25', 'Glenfarclas 25 Year Old', 'Glenfarclas', 'Glenfarclas', 'Speyside', 'Scotland', 25, 43.0, 700, 2020, 'Sherry')
on conflict (slug) do nothing;

do $$
declare
  b record;
  i int;
  base_price numeric;
  obs_date date;
  hammer numeric;
  premium numeric;
begin
  for b in
    select id, slug from public.bottles where slug in (
      'macallan-18-sherry-oak', 'springbank-15', 'yamazaki-12', 'hibiki-harmony', 'glenfarclas-25'
    )
  loop
    base_price := case b.slug
      when 'macallan-18-sherry-oak' then 420
      when 'springbank-15' then 280
      when 'yamazaki-12' then 350
      when 'hibiki-harmony' then 190
      when 'glenfarclas-25' then 310
      else 250
    end;

    for i in 0..23 loop
      obs_date := (current_date - (i || ' months')::interval)::date;
      if not exists (
        select 1 from public.price_observations
        where bottle_id = b.id and source = 'WhiskyAuctioneer' and observed_at = obs_date
      ) then
        hammer := round((base_price * (1 + i * 0.01 + 0.02))::numeric, 2);
        premium := round((hammer * 0.1)::numeric, 2);
        insert into public.price_observations (bottle_id, source, currency, hammer_price, buyer_premium, observed_at)
        values (b.id, 'WhiskyAuctioneer', 'GBP', hammer, premium, obs_date);
      end if;
    end loop;
  end loop;
end;
$$;
