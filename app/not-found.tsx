import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start justify-center px-4 py-16">
      <p className="label-meta">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink">Page not found</h1>
      <p className="mt-3 text-ink-muted">That route is not in the current WhiskyIndex mock universe.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/market" className="btn btn-primary px-4 py-2">
          Market overview
        </Link>
        <Link href="/screener" className="btn btn-ghost px-4 py-2">
          Screener
        </Link>
      </div>
    </div>
  );
}
