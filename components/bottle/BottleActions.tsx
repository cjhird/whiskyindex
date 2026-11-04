'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bookmark, Briefcase, Share2, Check } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { watchlistItems } from '@/lib/mock/watchlist';
import { cn } from '@/lib/format';

export function BottleActions({
  bottleId,
  bottleName,
  slug,
}: {
  bottleId: string;
  bottleName: string;
  slug: string;
}) {
  const { user, isLoading } = useAuth();
  const initiallySaved = useMemo(
    () => watchlistItems.some((w) => w.bottleId === bottleId),
    [bottleId]
  );
  const [saved, setSaved] = useState(initiallySaved);
  const [copied, setCopied] = useState(false);

  function requireAuth(href: string) {
    if (user) return href;
    return `/login?redirect=${encodeURIComponent(href)}`;
  }

  async function onShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: bottleName, url });
        return;
      }
    } catch {
      /* fall through */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  function onWatchlist() {
    if (!user) {
      window.location.href = requireAuth('/watchlist');
      return;
    }
    setSaved((v) => !v);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onWatchlist}
        disabled={isLoading}
        className={cn('btn btn-ghost', saved && user && 'bg-surface-muted')}
      >
        {saved && user ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {saved && user ? 'On watchlist' : 'Add to Watchlist'}
      </button>
      <Link href={requireAuth(`/portfolio?add=${encodeURIComponent(slug)}`)} className="btn btn-ghost">
        <Briefcase className="h-4 w-4" />
        Add to Portfolio
      </Link>
      <button type="button" onClick={onShare} className="btn btn-ghost">
        <Share2 className="h-4 w-4" />
        {copied ? 'Link copied' : 'Share'}
      </button>
    </div>
  );
}
