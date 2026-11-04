import Link from 'next/link';
import type { Bottle } from '@/lib/mock/types';
import { slugifyName } from '@/lib/mock/bottles';

export function BottleDetails({ bottle }: { bottle: Bottle }) {
  const distillerySlug = slugifyName(bottle.distillery);
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: 'Distillery',
      value: (
        <Link href={`/distilleries/${distillerySlug}`} className="hover:underline">
          {bottle.distillery}
        </Link>
      ),
    },
    { label: 'Country', value: bottle.country },
    { label: 'Region', value: bottle.region },
    { label: 'Whisky type', value: bottle.whiskyType },
    { label: 'Expression', value: bottle.name },
    {
      label: 'Age statement',
      value: bottle.ageYears != null ? `${bottle.ageYears} years` : 'No age statement',
    },
  ];

  if (bottle.vintageYear != null) {
    rows.push({ label: 'Vintage / distillation year', value: String(bottle.vintageYear) });
  }
  if (bottle.bottlingYear != null) {
    rows.push({ label: 'Bottling year', value: String(bottle.bottlingYear) });
  }
  rows.push({ label: 'Bottler', value: bottle.bottler });
  rows.push({ label: 'ABV', value: `${bottle.abv}%` });
  rows.push({ label: 'Bottle size', value: `${bottle.volumeMl} ml` });
  rows.push({ label: 'Cask type', value: bottle.caskType });
  if (bottle.caskNumber) {
    rows.push({ label: 'Cask number', value: bottle.caskNumber });
  }
  if (bottle.edition) {
    rows.push({ label: 'Edition / release', value: bottle.edition });
  }
  if (bottle.bottleCount != null) {
    rows.push({
      label: 'Number released',
      value: bottle.bottleCount.toLocaleString('en-GB'),
    });
  }
  rows.push({
    label: 'Bottling',
    value: bottle.officialBottling ? 'Official bottling' : 'Independent bottling',
  });

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold tracking-[-0.03em] text-ink">Bottle Details</h2>
      {bottle.description && (
        <p className="mb-6 max-w-3xl text-sm leading-6 text-ink-muted">{bottle.description}</p>
      )}
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6"
          >
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="text-sm font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
