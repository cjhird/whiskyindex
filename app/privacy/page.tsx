import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How the WhiskyIndex demo handles session cookies. Production privacy terms will expand with live accounts.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Privacy</h1>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          This page describes the demo build only. A production WhiskyIndex deployment will publish
          a full privacy notice covering authentication providers, analytics, and retention.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Demo session cookie</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Signing in stores a lightweight session cookie (`wi_session`) so portfolio and watchlist
          previews can persist in the browser. The cookie holds a mock email identifier only — not a
          password, payment detail, or third-party identity token.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">What we do not collect here</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
          <li>Newsletter forms are disabled and do not submit addresses</li>
          <li>No advertising or cross-site tracking pixels ship in this demo</li>
          <li>Auction marks shown on pages are mock product data, not personal data</li>
        </ul>
      </section>

      <p className="text-sm text-ink-muted">
        Questions:{' '}
        <Link href="/contact" className="text-ink hover:underline">
          Contact
        </Link>
        .
      </p>
    </div>
  );
}
