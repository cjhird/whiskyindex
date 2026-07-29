"use client";

import { Button } from "@whiskyindex/ui/button";
import { Input } from "@whiskyindex/ui/input";

export function SearchHero() {
  return (
    <section className="border-b border-border bg-background py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Search for any bottle
        </h1>
        <form action="/screener" method="get" className="mt-6">
          <Input
            type="search"
            name="q"
            placeholder="e.g. Macallan, Springbank, Yamazaki"
            className="py-3 text-base"
            autoFocus
          />
          <Button type="submit" className="mt-4 w-full sm:w-auto sm:px-8">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
