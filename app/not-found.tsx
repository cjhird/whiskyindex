import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start justify-center px-4 py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink">Bottle not found</h1>
      <p className="mt-3 text-ink-muted">That route is not in the current WhiskyIndex mock universe.</p>
      <Link
        href="/screener"
        className="mt-8 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
      >
        Back to screener
      </Link>
    </div>
  );
}
