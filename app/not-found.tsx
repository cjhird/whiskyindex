import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-600">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-md bg-[#ffb347] px-4 py-2 text-sm font-medium text-gray-900 hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/screener"
          className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Screener
        </Link>
      </div>
    </div>
  );
}
