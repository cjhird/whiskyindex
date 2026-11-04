import Link from 'next/link';

/** Single honesty line in the sticky header — not a second chrome bar below the tape. */
export function SiteDisclaimer() {
  return (
    <div className="border-b border-line bg-surface-muted/90">
      <p className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 text-xs text-ink-muted sm:text-sm">
        <span className="font-mono-num text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          Demo
        </span>
        <span>
          Marks for product design — not live auction prints or investment advice.{' '}
          <Link href="/methodology" className="text-ink hover:underline">
            Methodology
          </Link>
          {' · '}
          <Link href="/data-sources" className="text-ink hover:underline">
            Data sources
          </Link>
        </span>
      </p>
    </div>
  );
}
