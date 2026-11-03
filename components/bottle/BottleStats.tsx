import type { Bottle } from '@/lib/mock/types';

export function BottleStats({ bottle }: { bottle: Bottle }) {
  const items = [
    { label: '30D volume', value: String(bottle.volume30d) },
    { label: 'Liquidity', value: bottle.liquidity },
    { label: 'Lifetime lots', value: String(bottle.lotCount) },
    { label: 'Last house', value: bottle.lastAuction },
    {
      label: 'Release',
      value: bottle.releaseYear ? String(bottle.releaseYear) : '—',
    },
    {
      label: 'Outturn',
      value: bottle.bottleCount ? bottle.bottleCount.toLocaleString('en-GB') : 'Open',
    },
  ];

  return (
    <dl className="divide-y divide-line">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm text-ink-muted">{item.label}</dt>
          <dd className="font-mono-num text-sm font-medium text-ink text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
