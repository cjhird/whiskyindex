export default async function BottlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-xl font-semibold">Bottle</h1>
      <p className="mt-2 text-muted-foreground">
        Bottle detail for {id} — coming soon.
      </p>
    </div>
  );
}
