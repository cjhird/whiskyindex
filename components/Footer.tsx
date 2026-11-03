import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.03em] text-ink">WhiskyIndex</p>
          <p className="mt-2 max-w-sm text-sm text-ink-muted">
            Secondary-market marks, auction comps, and portfolio analytics for whisky collectors.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <Link href="/screener" className="hover:text-ink">
            Screener
          </Link>
          <Link href="/blog" className="hover:text-ink">
            Research
          </Link>
          <Link href="/portfolio" className="hover:text-ink">
            Portfolio
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-ink-faint">
          Data for illustration only. Not investment advice. Auction marks can diverge from private
          transaction prices.
        </p>
      </div>
    </footer>
  );
}
