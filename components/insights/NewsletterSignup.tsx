export function NewsletterSignup({
  variant = 'hub',
}: {
  variant?: 'hub' | 'article';
}) {
  const heading =
    variant === 'article' ? 'Get more whisky market insights.' : 'Stay ahead of the whisky market.';
  const copy =
    variant === 'article'
      ? 'Receive market reports, auction analysis and research from WhiskyIndex.'
      : 'Get the latest auction trends, market analysis and WhiskyIndex reports delivered to your inbox.';

  return (
    <section className="border border-line bg-surface-muted px-4 py-8 sm:px-6">
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">{heading}</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{copy}</p>
      <div className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`newsletter-email-${variant}`}>
          Email address
        </label>
        <input
          id={`newsletter-email-${variant}`}
          type="email"
          name="email"
          disabled
          placeholder="you@example.com"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink opacity-70"
        />
        <button type="button" disabled className="btn btn-primary shrink-0 opacity-55">
          Subscribe
        </button>
      </div>
      <p className="mt-3 text-sm text-ink-faint">
        Newsletter signup will activate once subscription and consent handling are live. No email is
        collected on this demo form.
      </p>
    </section>
  );
}
