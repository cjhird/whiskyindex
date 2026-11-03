'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { cn } from '@/lib/format';
import { Button } from '@/components/ui/Button';

const links = [
  { href: '/screener', label: 'Screener' },
  { href: '/blog', label: 'Research' },
  { href: '/portfolio', label: 'Portfolio' },
];

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="group shrink-0">
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">
            Whisky<span className="text-ink-muted group-hover:text-ink">Index</span>
          </span>
        </Link>

        <form action="/screener" method="get" className="mx-auto hidden min-w-0 flex-1 md:block md:max-w-md">
          <label className="relative block">
            <span className="sr-only">Search bottles</span>
            <input
              type="search"
              name="q"
              placeholder="Search any bottle, brand, region…"
              className="field py-2"
            />
          </label>
        </form>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
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

          {!isLoading && (
            <>
              {user ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="ml-1 px-3 py-1.5"
                  onClick={async () => {
                    await logout();
                    router.push('/');
                    router.refresh();
                  }}
                >
                  Sign out
                </Button>
              ) : (
                <Link href="/login" className="btn btn-primary ml-1 px-3 py-1.5">
                  Sign in
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
