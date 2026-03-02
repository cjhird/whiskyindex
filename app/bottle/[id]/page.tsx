export default function BottlePage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-xl font-semibold text-gray-900">Bottle</h1>
      <p className="mt-2 text-gray-600">Bottle detail for {params.id} — Phase 5.</p>
    </div>
  );
}
