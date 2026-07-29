-- WhiskyIndex RLS policies

alter table public.bottles enable row level security;
alter table public.price_observations enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_items enable row level security;

create policy "bottles_select_anon" on public.bottles for select to anon using (true);
create policy "bottles_select_authenticated" on public.bottles for select to authenticated using (true);

create policy "price_observations_select_anon" on public.price_observations for select to anon using (true);
create policy "price_observations_select_authenticated" on public.price_observations for select to authenticated using (true);

create policy "portfolios_select" on public.portfolios for select to authenticated using (auth.uid() = user_id);
create policy "portfolios_insert" on public.portfolios for insert to authenticated with check (auth.uid() = user_id);
create policy "portfolios_update" on public.portfolios for update to authenticated using (auth.uid() = user_id);
create policy "portfolios_delete" on public.portfolios for delete to authenticated using (auth.uid() = user_id);

create policy "portfolio_items_select" on public.portfolio_items for select to authenticated
  using (exists (select 1 from public.portfolios p where p.id = portfolio_items.portfolio_id and p.user_id = auth.uid()));
create policy "portfolio_items_insert" on public.portfolio_items for insert to authenticated
  with check (exists (select 1 from public.portfolios p where p.id = portfolio_items.portfolio_id and p.user_id = auth.uid()));
create policy "portfolio_items_update" on public.portfolio_items for update to authenticated
  using (exists (select 1 from public.portfolios p where p.id = portfolio_items.portfolio_id and p.user_id = auth.uid()));
create policy "portfolio_items_delete" on public.portfolio_items for delete to authenticated
  using (exists (select 1 from public.portfolios p where p.id = portfolio_items.portfolio_id and p.user_id = auth.uid()));
