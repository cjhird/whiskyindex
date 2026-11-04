import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact WhiskyIndex for partnerships, data licensing, or product feedback.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Contact</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        For partnerships, data licensing or product feedback, use{' '}
        <a href="mailto:hello@whiskyindex.com" className="text-ink underline-offset-2 hover:underline">
          hello@whiskyindex.com
        </a>
        . This address is illustrative in the demo build.
      </p>
    </div>
  );
}
