"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@whiskyindex/supabase/browser";
import { Button } from "@whiskyindex/ui/button";
import { Input } from "@whiskyindex/ui/input";
import { useAuth } from "@/components/Providers";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-whisky"
        >
          WhiskyIndex
        </Link>

        <form action="/screener" method="get" className="mx-4 flex max-w-md flex-1">
          <Input type="search" name="q" placeholder="Search for any bottle" />
        </form>

        <nav className="flex items-center gap-4">
          <Link
            href="/screener"
            className="text-sm text-muted-foreground hover:text-whisky"
          >
            Screener
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-muted-foreground hover:text-whisky"
          >
            Portfolio
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-whisky"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="max-w-[140px] truncate">
                      {user.email ?? "Account"}
                    </span>
                    <span className="text-muted-foreground">▾</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 hidden min-w-[120px] rounded-md border border-border bg-background py-1 shadow group-hover:block">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-whisky"
                  >
                    Login
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
