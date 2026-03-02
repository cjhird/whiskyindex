import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <Link href="/screener" className="hover:text-[#ffb347]">
            Screener
          </Link>
          <Link href="/portfolio" className="hover:text-[#ffb347]">
            Portfolio
          </Link>
          <Link href="/terms" className="hover:text-[#ffb347]">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-[#ffb347]">
            Privacy
          </Link>
        </nav>
        <p className="mt-3 text-center text-xs text-gray-500">
          Data for illustration only; not investment advice.
        </p>
      </div>
    </footer>
  );
}
