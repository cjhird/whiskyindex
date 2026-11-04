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
  const [authHint, setAuthHint] = useState<'watchlist' | 'portfolio' | null>(null);

  const watchlistHref = `/watchlist?add=${encodeURIComponent(slug)}`;
  const portfolioHref = `/portfolio?add=${encodeURIComponent(slug)}`;
  const loginWatchlist = `/login?redirect=${encodeURIComponent(watchlistHref)}`;
  const loginPortfolio = `/login?redirect=${encodeURIComponent(portfolioHref)}`;

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
      setAuthHint('watchlist');
      return;
    }
    setAuthHint(null);
    setSaved((v) => !v);
  }

  function onPortfolioClick() {
    if (!user) {
      setAuthHint('portfolio');
    }
  }

  return (
    <div className="space-y-3">
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
        <Link href={portfolioHref} className="btn btn-ghost" onClick={onPortfolioClick}>
          <Briefcase className="h-4 w-4" />
          Add to Portfolio
        </Link>
        <button type="button" onClick={onShare} className="btn btn-ghost">
          <Share2 className="h-4 w-4" />
          {copied ? 'Link copied' : 'Share'}
        </button>
      </div>

      {authHint && !user && (
        <p className="text-sm text-ink-muted">
          Sign in to {authHint === 'watchlist' ? 'save this bottle to your watchlist' : 'add this bottle to your portfolio'}.{' '}
          <Link
            href={authHint === 'watchlist' ? loginWatchlist : loginPortfolio}
            className="font-medium text-ink hover:underline"
          >
            Sign in
          </Link>
          {' · '}
          <Link
            href={authHint === 'watchlist' ? watchlistHref : portfolioHref}
            className="hover:underline"
          >
            Preview {authHint}
          </Link>
        </p>
      )}
    </div>
  );
}
