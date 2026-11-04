import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact WhiskyIndex for partnerships, data licensing, or product feedback.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Contact</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          For partnerships, data licensing, press, or product feedback, email{' '}
          <a
            href="mailto:hello@whiskyindex.com"
            className="text-ink underline-offset-2 hover:underline"
          >
            hello@whiskyindex.com
          </a>
          . That address is illustrative in this demo build — messages are not monitored as a live
          inbox here.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">What to include</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Your organisation and role</li>
          <li>Whether the request is about data coverage, licensing, or product feedback</li>
          <li>Any bottle, house, or region references that help triage</li>
        </ul>
      </section>

      <p className="text-sm text-ink-muted">
        For account or privacy questions see{' '}
        <Link href="/privacy" className="text-ink hover:underline">
          Privacy
        </Link>{' '}
        and{' '}
        <Link href="/disclaimer" className="text-ink hover:underline">
          Disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
