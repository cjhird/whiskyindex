import Link from 'next/link';

const COLLECTIONS = [
  { name: 'Japanese', href: '/screener?country=Japan', description: 'Bottles from Japan' },
  { name: 'Scotch', href: '/screener?region=Scotland', description: 'Scottish whisky' },
  { name: 'Macallan', href: '/screener?brand=Macallan', description: 'Macallan bottlings' },
  { name: 'Springbank', href: '/screener?brand=Springbank', description: 'Springbank distillery' },
] as const;

export function CollectionCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-lg font-semibold text-gray-900">Featured collections</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-[#ffb347] hover:shadow-sm"
          >
            <span className="font-medium text-gray-900">{c.name}</span>
            <p className="mt-1 text-sm text-gray-500">{c.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
