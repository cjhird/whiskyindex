import type { Bottle } from '@/lib/mock/types';

export function BottleStats({ bottle }: { bottle: Bottle }) {
  const items = [
    { label: '30D volume', value: String(bottle.volume30d), hint: 'Closed lots' },
    { label: 'Liquidity', value: bottle.liquidity, hint: 'Relative depth' },
    { label: 'Lifetime lots', value: String(bottle.lotCount), hint: 'Indexed comps' },
    { label: 'Last house', value: bottle.lastAuction, hint: 'Most recent venue' },
    {
      label: 'Release',
      value: bottle.releaseYear ? String(bottle.releaseYear) : '—',
      hint: 'Bottling year',
    },
    {
      label: 'Outturn',
      value: bottle.bottleCount ? bottle.bottleCount.toLocaleString('en-GB') : 'Open',
      hint: 'Known bottles',
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="surface-panel rounded-lg px-4 py-3.5">
          <p className="label-caps">{item.label}</p>
          <p className="mt-1.5 font-mono-num text-lg font-semibold text-ink">{item.value}</p>
          <p className="mt-1 text-xs font-medium text-ink-muted">{item.hint}</p>
        </div>
      ))}
    </div>
  );
}
