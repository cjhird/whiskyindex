'use client';

import { useState } from 'react';
import { cn } from '@/lib/format';

export function ArticleToc({
  headings,
}: {
  headings: Array<{ id: string; text: string }>;
}) {
  const [open, setOpen] = useState(false);
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="border border-line">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-ink lg:cursor-default"
        onClick={() => setOpen((v) => !v)}
      >
        On this page
        <span className="text-ink-muted lg:hidden">{open ? 'Hide' : 'Show'}</span>
      </button>
      <ul
        className={cn(
          'space-y-2 border-t border-line px-4 py-3 text-sm',
          open ? 'block' : 'hidden lg:block'
        )}
      >
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-ink-muted hover:text-ink">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
