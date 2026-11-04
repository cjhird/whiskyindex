import Link from 'next/link';
import type { Bottle } from '@/lib/mock/types';
import { slugifyName } from '@/lib/mock/bottles';
import { BottleImage } from '@/components/bottle/BottleImage';
import { BottleActions } from '@/components/bottle/BottleActions';

export function BottleHeader({ bottle }: { bottle: Bottle }) {
  const distillerySlug = slugifyName(bottle.distillery);
  const identity = [
    bottle.ageYears != null ? `${bottle.ageYears} Year Old` : 'No age statement',
    bottle.edition,
    bottle.officialBottling ? 'Official bottling' : `Bottled by ${bottle.bottler}`,
  ].filter(Boolean) as string[];

  const technical = [
    bottle.vintageYear ? `Distilled ${bottle.vintageYear}` : null,
    bottle.bottlingYear ? `Bottled ${bottle.bottlingYear}` : null,
    `${bottle.abv}% ABV`,
    `${bottle.volumeMl} ml`,
    bottle.caskType,
  ].filter(Boolean) as string[];

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <Link href="/bottles" className="hover:text-ink">
            Bottles
          </Link>
          <span className="text-ink-faint" aria-hidden>
            /
          </span>
          <Link href={`/distilleries/${distillerySlug}`} className="hover:text-ink">
            {bottle.distillery}
          </Link>
          <span className="text-ink-faint" aria-hidden>
            /
          </span>
          <span className="text-ink">{bottle.name}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <BottleImage bottle={bottle} className="shrink-0 self-center lg:self-start" />

          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-muted">
              <Link href={`/distilleries/${distillerySlug}`} className="font-medium text-ink hover:underline">
                {bottle.distillery}
              </Link>
              <span className="text-ink-faint"> · </span>
              {bottle.country}
              <span className="text-ink-faint"> · </span>
              {bottle.region}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              {bottle.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
              {identity.join(' · ')}
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-faint">
              {technical.join(' · ')}
            </p>

            {bottle.description && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted">{bottle.description}</p>
            )}

            <div className="mt-6">
              <BottleActions bottleId={bottle.id} bottleName={bottle.name} slug={bottle.slug} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
