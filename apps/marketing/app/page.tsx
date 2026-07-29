import { Button } from "@whiskyindex/ui/button";

const platformUrl =
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? "http://localhost:3001";

const FEATURES = [
  {
    title: "Auction price history",
    description:
      "Track hammer prices and buyer premiums from secondary market sales.",
  },
  {
    title: "Bottle screener",
    description:
      "Filter rare and limited releases by brand, region, country, and price.",
  },
  {
    title: "Portfolio tracking",
    description:
      "Log purchases and compare against latest market prices over time.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-whisky">
            For collectors and buyers
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Investment analytics for rare whisky
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            WhiskyIndex brings bottle data, auction pricing, and portfolio tools
            together — so you can research secondary market values with confidence.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={`${platformUrl}/screener`}>Open screener</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`${platformUrl}/signup`}>Create free account</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold">Built for the bottle</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Data-first tools for limited releases and auction markets.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border p-6"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-semibold">Start researching today</h2>
          <p className="mt-2 text-muted-foreground">
            Browse the screener with demo data, or connect your account when
            you&apos;re ready.
          </p>
          <Button asChild className="mt-6" size="lg">
            <a href={`${platformUrl}`}>Go to platform</a>
          </Button>
        </div>
      </section>
    </>
  );
}
