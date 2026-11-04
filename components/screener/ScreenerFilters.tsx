'use client';

import {
  bottleSizes,
  caskTypes,
  distillersList,
  countries,
  regions,
  type ScreenerFilters,
} from '@/lib/mock/screener';
import { cn } from '@/lib/format';

type Props = {
  draft: ScreenerFilters;
  setDraft: (next: ScreenerFilters) => void;
  onApply: () => void;
  onReset: () => void;
  className?: string;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-sm font-medium text-ink">{children}</p>;
}

function NumInput({
  value,
  onChange,
  placeholder,
}: {
  value?: number;
  onChange: (v?: number) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? undefined : Number(v));
      }}
      className="field py-1.5"
    />
  );
}

function MultiSelect({
  options,
  value = [],
  onChange,
}: {
  options: string[];
  value?: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <select
      multiple
      value={value}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
        onChange(selected);
      }}
      className="field min-h-[6.5rem] py-1.5 text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function ScreenerFilterPanel({ draft, setDraft, onApply, onReset, className }: Props) {
  const patch = (partial: Partial<ScreenerFilters>) => setDraft({ ...draft, ...partial, page: 1 });

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="text-sm font-semibold text-ink">Filters</p>
        <button type="button" onClick={onReset} className="text-sm text-ink-muted hover:text-ink">
          Reset filters
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <section>
          <p className="label-meta mb-3">Whisky details</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>Distillery</FieldLabel>
              <MultiSelect
                options={distillersList()}
                value={draft.distillery}
                onChange={(distillery) => patch({ distillery: distillery.length ? distillery : undefined })}
              />
              <p className="mt-1 text-xs text-ink-faint">Hold Cmd/Ctrl to multi-select</p>
            </div>
            <div>
              <FieldLabel>Country</FieldLabel>
              <MultiSelect
                options={countries()}
                value={draft.country}
                onChange={(country) => patch({ country: country.length ? country : undefined })}
              />
            </div>
            <div>
              <FieldLabel>Region</FieldLabel>
              <MultiSelect
                options={regions()}
                value={draft.region}
                onChange={(region) => patch({ region: region.length ? region : undefined })}
              />
            </div>
            <div>
              <FieldLabel>Bottler</FieldLabel>
              <select
                className="field py-1.5"
                value={draft.bottler ?? ''}
                onChange={(e) => patch({ bottler: e.target.value || undefined })}
              >
                <option value="">Any</option>
                <option value="Official">Official</option>
                <option value="Independent">Independent</option>
              </select>
            </div>
            <div>
              <FieldLabel>Age statement</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <NumInput value={draft.minAge} onChange={(minAge) => patch({ minAge })} placeholder="Min" />
                <NumInput value={draft.maxAge} onChange={(maxAge) => patch({ maxAge })} placeholder="Max" />
              </div>
            </div>
            <div>
              <FieldLabel>Bottling / release year</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <NumInput
                  value={draft.minVintage}
                  onChange={(minVintage) => patch({ minVintage })}
                  placeholder="From"
                />
                <NumInput
                  value={draft.maxVintage}
                  onChange={(maxVintage) => patch({ maxVintage })}
                  placeholder="To"
                />
              </div>
            </div>
            <div>
              <FieldLabel>ABV %</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <NumInput value={draft.minAbv} onChange={(minAbv) => patch({ minAbv })} placeholder="Min" />
                <NumInput value={draft.maxAbv} onChange={(maxAbv) => patch({ maxAbv })} placeholder="Max" />
              </div>
            </div>
            <div>
              <FieldLabel>Bottle size</FieldLabel>
              <select
                className="field py-1.5"
                value={draft.size ?? ''}
                onChange={(e) => patch({ size: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Any</option>
                {bottleSizes().map((s) => (
                  <option key={s} value={s}>
                    {s}ml
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Cask type</FieldLabel>
              <select
                className="field py-1.5"
                value={draft.cask ?? ''}
                onChange={(e) => patch({ cask: e.target.value || undefined })}
              >
                <option value="">Any</option>
                {caskTypes().map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section>
          <p className="label-meta mb-3">Pricing</p>
          <p className="mb-3 text-xs leading-5 text-ink-faint">
            Buyer-inclusive totals where recorded. Illustrative mock data.
          </p>
          <div className="space-y-4">
            <div>
              <FieldLabel>Latest auction price (£)</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <NumInput value={draft.minPrice} onChange={(minPrice) => patch({ minPrice })} placeholder="Min" />
                <NumInput value={draft.maxPrice} onChange={(maxPrice) => patch({ maxPrice })} placeholder="Max" />
              </div>
            </div>
            <div>
              <FieldLabel>12M median (£)</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <NumInput
                  value={draft.minMedian}
                  onChange={(minMedian) => patch({ minMedian })}
                  placeholder="Min"
                />
                <NumInput
                  value={draft.maxMedian}
                  onChange={(maxMedian) => patch({ maxMedian })}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="label-meta mb-3">Market performance</p>
          <p className="mb-3 text-xs leading-5 text-ink-faint">
            12M change only when ≥12 recorded lots. Insufficient samples are excluded from % filters.
          </p>
          <div>
            <FieldLabel>12M price change (%)</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <NumInput
                value={draft.minChange12m}
                onChange={(minChange12m) => patch({ minChange12m })}
                placeholder="Min"
              />
              <NumInput
                value={draft.maxChange12m}
                onChange={(maxChange12m) => patch({ maxChange12m })}
                placeholder="Max"
              />
            </div>
          </div>
        </section>

        <section>
          <p className="label-meta mb-3">Trading activity</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>12M sales (count)</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <NumInput value={draft.minSales} onChange={(minSales) => patch({ minSales })} placeholder="Min" />
                <NumInput value={draft.maxSales} onChange={(maxSales) => patch({ maxSales })} placeholder="Max" />
              </div>
            </div>
            <div>
              <FieldLabel>Liquidity</FieldLabel>
              <select
                className="field py-1.5"
                value={draft.liquidity ?? ''}
                onChange={(e) => patch({ liquidity: e.target.value || undefined })}
              >
                <option value="">Any</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <FieldLabel>Last sold after</FieldLabel>
              <input
                type="date"
                className="field py-1.5"
                value={draft.lastSoldAfter ?? ''}
                onChange={(e) => patch({ lastSoldAfter: e.target.value || undefined })}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-line p-4">
        <button type="button" onClick={onApply} className="btn btn-primary w-full py-2.5">
          Apply filters
        </button>
      </div>
    </div>
  );
}
