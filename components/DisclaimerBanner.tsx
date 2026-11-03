export function DisclaimerBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="surface-panel rounded-lg px-4 py-3 text-sm text-ink-muted">
      {children ?? (
        <>
          <span className="font-semibold text-ink">Illustrative marks.</span> Auction totals shown here
          are for product design and demonstration only — not investment advice.
        </>
      )}
    </div>
  );
}
