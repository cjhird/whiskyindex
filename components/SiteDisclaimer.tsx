import Link from 'next/link';

/** Single site-level honesty line — avoid repeating on every section. */
export function SiteDisclaimer() {
  return (
    <div className="border-b border-line bg-surface-muted">
      <p className="mx-auto max-w-7xl px-4 py-2 text-sm text-ink-muted">
        Demo marks for product design — not live auction prints or investment advice.{' '}
        <Link href="/methodology" className="text-ink hover:underline">
          Methodology
        </Link>
        {' · '}
        <Link href="/data-sources" className="text-ink hover:underline">
          Data sources
        </Link>
      </p>
    </div>
  );
}
