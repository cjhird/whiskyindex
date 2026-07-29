-- WhiskyIndex RPCs

create or replace function public.search_bottles(
  q text default null,
  brand text default null,
  region text default null,
  country text default null,
  min_price numeric default null,
  max_price numeric default null,
  sort text default 'latest_price_desc',
  page int default 1,
  page_size int default 20
)
returns table (
  id uuid,
  slug text,
  name text,
  brand text,
  distillery text,
  region text,
  country text,
  age_years int,
  abv numeric,
  volume_ml int,
  release_year int,
  cask_type text,
  bottle_count int,
  created_at timestamptz,
  latest_price numeric,
  total_count bigint
)
language sql
stable
as $$
  with latest_prices as (
    select distinct on (bottle_id) bottle_id, total_price as lp
    from public.price_observations
    order by bottle_id, observed_at desc
  ),
  bwp as (
    select b.*, coalesce(lp.lp, 0) as latest_price
    from public.bottles b
    left join latest_prices lp on lp.bottle_id = b.id
  ),
  filtered as (
    select * from bwp
    where
      (search_bottles.q is null or search_bottles.q = '' or bwp.name ilike '%' || search_bottles.q || '%' or bwp.slug ilike '%' || search_bottles.q || '%' or bwp.brand ilike '%' || search_bottles.q || '%')
      and (search_bottles.brand is null or search_bottles.brand = '' or bwp.brand = search_bottles.brand)
      and (search_bottles.region is null or search_bottles.region = '' or bwp.region = search_bottles.region)
      and (search_bottles.country is null or search_bottles.country = '' or bwp.country = search_bottles.country)
      and (search_bottles.min_price is null or bwp.latest_price >= search_bottles.min_price)
      and (search_bottles.max_price is null or bwp.latest_price <= search_bottles.max_price)
  ),
  with_count as (
    select *, count(*) over () as total_count from filtered
  )
  select
    with_count.id,
    with_count.slug,
    with_count.name,
    with_count.brand,
    with_count.distillery,
    with_count.region,
    with_count.country,
    with_count.age_years,
    with_count.abv,
    with_count.volume_ml,
    with_count.release_year,
    with_count.cask_type,
    with_count.bottle_count,
    with_count.created_at,
    with_count.latest_price,
    with_count.total_count
  from with_count
  order by
    case when search_bottles.sort = 'latest_price_desc' then with_count.latest_price end desc nulls last,
    case when search_bottles.sort = 'latest_price_asc' then with_count.latest_price end asc nulls last,
    case when search_bottles.sort = 'name_asc' then with_count.name end asc nulls last,
    case when search_bottles.sort = 'brand_asc' then with_count.brand end asc nulls last
  offset (search_bottles.page - 1) * search_bottles.page_size
  limit search_bottles.page_size;
$$;

create or replace function public.get_bottle_metrics(bottle_uuid uuid)
returns table (
  latest_price numeric,
  latest_date date,
  change_30d_pct numeric,
  change_90d_pct numeric,
  change_365d_pct numeric,
  num_observations bigint,
  simple_volatility numeric
)
language plpgsql
stable
as $$
declare
  price_now numeric;
  date_now date;
  val_30 numeric;
  val_90 numeric;
  val_365 numeric;
  obs_count bigint;
  vol numeric;
begin
  select total_price, observed_at into price_now, date_now
  from public.price_observations
  where bottle_id = bottle_uuid
  order by observed_at desc
  limit 1;

  if date_now is null then
    select count(*) into obs_count from public.price_observations where bottle_id = bottle_uuid;
    return query select null::numeric, null::date, null::numeric, null::numeric, null::numeric, obs_count, null::numeric;
    return;
  end if;

  select total_price into val_30 from public.price_observations
  where bottle_id = bottle_uuid and observed_at <= (date_now - interval '30 days')::date
  order by observed_at desc limit 1;

  select total_price into val_90 from public.price_observations
  where bottle_id = bottle_uuid and observed_at <= (date_now - interval '90 days')::date
  order by observed_at desc limit 1;

  select total_price into val_365 from public.price_observations
  where bottle_id = bottle_uuid and observed_at <= (date_now - interval '365 days')::date
  order by observed_at desc limit 1;

  select count(*) into obs_count from public.price_observations where bottle_id = bottle_uuid;

  with ordered as (
    select total_price, lag(total_price) over (order by observed_at) as prev_price
    from public.price_observations
    where bottle_id = bottle_uuid
  ),
  changes as (
    select case when prev_price > 0 then (total_price - prev_price) / prev_price else null end as pct_change
    from ordered
    where prev_price is not null
  )
  select coalesce(stddev(pct_change), 0) into vol from changes;

  return query select
    price_now,
    date_now,
    case when val_30 > 0 then round(((price_now - val_30) / val_30 * 100)::numeric, 2) else null end,
    case when val_90 > 0 then round(((price_now - val_90) / val_90 * 100)::numeric, 2) else null end,
    case when val_365 > 0 then round(((price_now - val_365) / val_365 * 100)::numeric, 2) else null end,
    obs_count,
    round(coalesce(vol, 0)::numeric, 4);
end;
$$;

create or replace function public.get_latest_prices(bottle_ids uuid[])
returns table (bottle_id uuid, latest_price numeric, currency text)
language sql
stable
as $$
  select distinct on (p.bottle_id) p.bottle_id, p.total_price as latest_price, p.currency
  from public.price_observations p
  where p.bottle_id = any(get_latest_prices.bottle_ids)
  order by p.bottle_id, p.observed_at desc;
$$;

grant execute on function public.search_bottles to anon;
grant execute on function public.search_bottles to authenticated;
grant execute on function public.get_bottle_metrics to anon;
grant execute on function public.get_bottle_metrics to authenticated;
grant execute on function public.get_latest_prices to anon;
grant execute on function public.get_latest_prices to authenticated;
