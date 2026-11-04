'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChartNoAxesCombined } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { cn } from '@/lib/format';

const mainLinks = [
  { href: '/market', label: 'Market' },
  { href: '/screener', label: 'Screener' },
  { href: '/insights', label: 'Insights' },
];

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <ChartNoAxesCombined
            aria-hidden
            className="size-[1.125rem] stroke-[1.75] text-ink"
          />
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">
            Whisky<span className="text-ink-muted group-hover:text-ink">Index</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-sm font-medium transition',
                pathname === l.href || pathname.startsWith(`${l.href}/`)
                  ? 'bg-surface-muted text-ink'
                  : 'text-ink-muted hover:text-ink'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form action="/screener" method="get" className="mx-auto hidden min-w-0 flex-1 md:block md:max-w-md">
          <label className="relative block">
            <span className="sr-only">Search bottles</span>
            <input
              type="search"
              name="q"
              placeholder="Search any bottle, brand, region…"
              className="field border-transparent bg-surface-muted py-2 focus:border-line-strong focus:bg-white"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/pricing"
            className="hidden rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-muted transition hover:text-ink sm:inline"
          >
            Pricing
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-sm font-medium transition',
                      accountOpen || pathname.startsWith('/portfolio') || pathname.startsWith('/watchlist')
                        ? 'bg-surface-muted text-ink'
                        : 'text-ink-muted hover:text-ink'
                    )}
                    aria-expanded={accountOpen}
                    aria-haspopup="menu"
                  >
                    Account
                  </button>
                  {accountOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-sm"
                    >
                      <Link
                        href="/portfolio"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-ink hover:bg-surface-hover"
                      >
                        Portfolio
                      </Link>
                      <Link
                        href="/watchlist"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-ink hover:bg-surface-hover"
                      >
                        Watchlist
                      </Link>
                      <Link
                        href="/pricing"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-ink hover:bg-surface-hover"
                      >
                        Pricing
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3 py-2 text-left text-sm text-ink-muted hover:bg-surface-hover hover:text-ink"
                        onClick={async () => {
                          await logout();
                          setAccountOpen(false);
                          router.push('/');
                          router.refresh();
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost px-3 py-1.5">
                    Sign in
                  </Link>
                  <Link href="/pricing" className="btn btn-primary px-3 py-1.5 sm:hidden">
                    Pricing
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile main nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 sm:hidden">
        {mainLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1 text-sm font-medium',
              pathname === l.href || pathname.startsWith(`${l.href}/`)
                ? 'bg-surface-muted text-ink'
                : 'text-ink-muted'
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
