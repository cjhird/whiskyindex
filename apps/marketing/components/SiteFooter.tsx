import Link from "next/link";

const platformUrl =
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? "http://localhost:3001";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href={`${platformUrl}/screener`} className="hover:text-whisky">
            Screener
          </a>
          <Link href="/privacy" className="hover:text-whisky">Privacy</Link>
          <Link href="/terms" className="hover:text-whisky">Terms</Link>
        </nav>
        <p className="mt-4 text-xs">
          Data for illustration only; not investment advice.
        </p>
      </div>
    </footer>
  );
}
