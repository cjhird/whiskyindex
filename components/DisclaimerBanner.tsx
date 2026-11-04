export function DisclaimerBanner({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-sm text-ink-muted">
      {children ?? (
        <>
          <span className="text-ink">Illustrative marks.</span> Auction totals shown here are for
          product design only — not investment advice.
        </>
      )}
    </p>
  );
}
