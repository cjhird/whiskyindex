import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/screener" className="hover:text-whisky">Screener</Link>
          <Link href="/portfolio" className="hover:text-whisky">Portfolio</Link>
          <Link href="/terms" className="hover:text-whisky">Terms</Link>
          <Link href="/privacy" className="hover:text-whisky">Privacy</Link>
        </nav>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Data for illustration only; not investment advice.
        </p>
      </div>
    </footer>
  );
}
