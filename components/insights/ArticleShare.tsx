'use client';

import { useState } from 'react';
import { Link2, Share2 } from 'lucide-react';

export function ArticleShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }
    } catch {
      /* fall through */
    }
    await copyLink();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copyLink} className="btn btn-ghost">
        <Link2 className="h-4 w-4" />
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <button type="button" onClick={share} className="btn btn-ghost">
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
