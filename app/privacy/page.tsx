export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Privacy</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        This demo build stores a lightweight session cookie for mock sign-in only. A production
        WhiskyIndex deployment will document authentication, analytics, and data retention in full.
      </p>
    </div>
  );
}
