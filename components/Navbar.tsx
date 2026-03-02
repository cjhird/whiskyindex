'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { createClient } from '@/lib/supabaseClient';

export function Navbar() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-[#ffb347]">
          WhiskyIndex
        </Link>

        <form action="/screener" method="get" className="flex flex-1 max-w-md mx-4">
          <input
            type="search"
            name="q"
            placeholder="Search for any bottle"
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-[#ffb347] focus:outline-none focus:ring-1 focus:ring-[#ffb347]"
          />
        </form>

        <nav className="flex items-center gap-4">
          <Link
            href="/screener"
            className="text-sm text-gray-600 hover:text-[#ffb347]"
          >
            Screener
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-gray-600 hover:text-[#ffb347]"
          >
            Portfolio
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#ffb347]"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="max-w-[140px] truncate">
                      {user.email ?? 'Account'}
                    </span>
                    <span className="text-gray-400">▾</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 hidden min-w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow group-hover:block">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-[#ffb347]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-[#ffb347] px-3 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
