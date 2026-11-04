import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Sources',
  description:
    'Where WhiskyIndex auction evidence comes from, and how the demo dataset relates to production coverage.',
  alternates: { canonical: '/data-sources' },
};

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Data Sources</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          Production WhiskyIndex will index closed lots from major secondary-market auction houses.
          Figures in this build are illustrative placeholders for product design.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Intended coverage</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Closed UK and specialist whisky auction calendars</li>
          <li>Hammer and buyer premium where published</li>
          <li>Lot references and condition notes when provided by the house</li>
          <li>Links back to original lot pages for traceability</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Demo dataset</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          The demo generates deterministic mock histories per canonical bottle so UI, charts and
          comps can be reviewed without live ingestion. Treat every printed total as illustrative
          until production coverage is connected.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Refresh</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Demo clock as-of date is shown on bottle Data &amp; methodology blocks. Production refreshes
          will publish an explicit last-updated timestamp on market and bottle surfaces.
        </p>
      </section>

      <Link href="/methodology" className="inline-block text-sm font-medium text-ink hover:underline">
        Read methodology →
      </Link>
    </div>
  );
}
