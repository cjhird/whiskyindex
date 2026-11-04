import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Data Sources' };

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Data Sources</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        Production WhiskyIndex will index closed auction results from major houses. Figures shown in
        this demo are illustrative placeholders for product design and are not live auction prints.
      </p>
      <Link href="/methodology" className="mt-8 inline-block text-sm font-medium text-ink hover:underline">
        Read methodology →
      </Link>
    </div>
  );
}
