import Link from 'next/link';

export function AccountGatePreview({
  title,
  description,
  redirectTo,
  intentNote,
}: {
  title: string;
  description: string;
  redirectTo: string;
  intentNote?: string;
}) {
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{description}</p>
      {intentNote && <p className="mt-3 text-sm text-ink">{intentNote}</p>}

      <div className="mt-8 border border-line px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-ink">Sign in to continue</p>
        <p className="mt-2 max-w-lg text-sm leading-6 text-ink-muted">
          You can research bottles, markets and insights without an account. Saving a watchlist or
          portfolio requires a demo sign-in.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={loginHref} className="btn btn-primary">
            Sign in
          </Link>
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="btn btn-ghost"
          >
            Create account
          </Link>
          <Link href="/screener" className="btn btn-ghost">
            Continue researching →
          </Link>
        </div>
      </div>
    </div>
  );
}
