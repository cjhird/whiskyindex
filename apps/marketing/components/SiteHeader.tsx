import Link from "next/link";
import { Button } from "@whiskyindex/ui/button";

const platformUrl =
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? "http://localhost:3001";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold hover:text-whisky">
          WhiskyIndex
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-whisky"
          >
            Features
          </Link>
          <Button asChild size="sm" variant="outline">
            <a href={`${platformUrl}/login`}>Log in</a>
          </Button>
          <Button asChild size="sm">
            <a href={`${platformUrl}/signup`}>Get started</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
