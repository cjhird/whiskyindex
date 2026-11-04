'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ChartNoAxesCombined, Search, X } from 'lucide-react';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setSearchOpen(false);
    router.push(query ? `/screener?q=${encodeURIComponent(query)}` : '/screener');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <ChartNoAxesCombined aria-hidden className="size-[1.125rem] stroke-[1.75] text-ink" />
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">
            Whisky<span className="text-ink-muted group-hover:text-ink">Index</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Search bottles, releases and distilleries"
            onClick={() => setSearchOpen(true)}
            className="rounded-md p-2 text-ink-muted transition hover:bg-surface-hover hover:text-ink"
          >
            <Search className="size-4 stroke-[1.75]" />
          </button>

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
                      <Link href="/portfolio" role="menuitem" className="block px-3 py-2 text-sm text-ink hover:bg-surface-hover">
                        Portfolio
                      </Link>
                      <Link href="/watchlist" role="menuitem" className="block px-3 py-2 text-sm text-ink hover:bg-surface-hover">
                        Watchlist
                      </Link>
                      <Link href="/pricing" role="menuitem" className="block px-3 py-2 text-sm text-ink hover:bg-surface-hover">
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
                  <Link href="/login" className="rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-muted transition hover:text-ink">
                    Sign in
                  </Link>
                  <Link href="/signup" className="btn btn-primary px-3 py-1.5">
                    Get started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden">
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

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)}>
          <div
            className="mx-auto mt-16 max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={onSearch} className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              <div className="flex items-center gap-2 px-3">
                <Search className="size-4 shrink-0 text-ink-faint" aria-hidden />
                <input
                  ref={searchInputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search bottles, distilleries, releases…"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-faint"
                  autoComplete="off"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-md p-1.5 text-ink-muted hover:bg-surface-hover hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-line px-3 py-2 text-xs text-ink-muted">
                <span>Bottles, releases and distilleries</span>
                <button type="submit" className="font-medium text-ink hover:underline">
                  Search →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
