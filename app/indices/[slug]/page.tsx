import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getIndexProfile, indexHistory, indexProfiles } from '@/lib/mock/indices';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { IndexMiniChart } from '@/components/home/IndexMiniChart';
import { StatusChip } from '@/components/ui/StatusChip';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return indexProfiles.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const idx = getIndexProfile(params.slug);
  if (!idx) return { title: 'Index' };
  return {
    title: idx.name,
    description: `${idx.name} — ${idx.description}`,
    alternates: { canonical: `/indices/${idx.slug}` },
  };
}

export default function IndexDetailPage({ params }: Props) {
  const idx = getIndexProfile(params.slug);
  if (!idx) notFound();

  const chart = indexHistory(idx.slug, 24);
  const siblings = indexProfiles.filter((i) => i.slug !== idx.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/indices" className="hover:text-ink">
          Indices
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">{idx.name}</span>
      </nav>

      <header className="border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            {idx.name}
          </h1>
          <StatusChip>
            {idx.methodologyStatus === 'planned' ? 'Planned' : 'Illustrative'}
          </StatusChip>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {idx.category} · {idx.currency} · As of {idx.asOf}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">{idx.description}</p>

        <div className="mt-8 flex flex-wrap items-end gap-8">
          <div>
            <p className="label-meta">Level</p>
            <p className="mt-1 font-mono-num text-4xl font-semibold tracking-tight text-ink">
              {idx.value.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="label-meta">1D</p>
            <p className="mt-1">
              <ChangeBadge value={idx.change1d} />
            </p>
          </div>
          <div>
            <p className="label-meta">1M</p>
            <p className="mt-1">
              <ChangeBadge value={idx.change1m} />
            </p>
          </div>
          <div>
            <p className="label-meta">1Y</p>
            <p className="mt-1">
              <ChangeBadge value={idx.change1y} />
            </p>
          </div>
        </div>
      </header>

      <section className="mt-10 border border-line">
        <div className="border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">Path · 24M</p>
          <p className="mt-1 text-sm text-ink-muted">Monthly closes for layout</p>
        </div>
        <IndexMiniChart points={chart} className="px-2 py-3 sm:px-4" />
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Construction</h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">{idx.construction}</p>
          <p className="mt-4 text-sm leading-7 text-ink-muted">
            <span className="font-medium text-ink">Constituents. </span>
            {idx.constituents}
          </p>
          <Link
            href="/methodology"
            className="mt-4 inline-block text-sm font-medium text-ink hover:underline"
          >
            Full methodology →
          </Link>
        </section>
        <section>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Limitations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
            {idx.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-semibold text-ink">Other series</h2>
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {siblings.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/indices/${s.slug}`}
                className="row-hover flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-sm text-ink-muted">{s.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono-num text-sm text-ink">{s.value.toFixed(1)}</p>
                  <ChangeBadge value={s.change1m} size="sm" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
