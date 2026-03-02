'use client';

export function SearchHero() {
  return (
    <section className="border-b border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Search for any bottle
        </h1>
        <form action="/screener" method="get" className="mt-6">
          <input
            type="search"
            name="q"
            placeholder="e.g. Macallan, Springbank, Yamazaki"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-[#ffb347] focus:outline-none focus:ring-2 focus:ring-[#ffb347]/30"
            autoFocus
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-[#ffb347] px-4 py-3 text-sm font-medium text-gray-900 hover:opacity-90 sm:w-auto sm:px-8"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
