import { cn } from '@/lib/format';
import type { ArticleCover as CoverTone } from '@/lib/mock/types';

const TONE: Record<CoverTone, { bg: string; ink: string; rule: string }> = {
  slate: { bg: 'bg-[#e8eaed]', ink: 'text-[#3a4048]', rule: 'stroke-[#9aa3ad]' },
  oak: { bg: 'bg-[#efe6d8]', ink: 'text-[#5c4328]', rule: 'stroke-[#c4a882]' },
  peat: { bg: 'bg-[#e4ebe6]', ink: 'text-[#2f4538]', rule: 'stroke-[#8fad9a]' },
  amber: { bg: 'bg-[#f3e7d6]', ink: 'text-[#6a4a22]', rule: 'stroke-[#d4b07a]' },
};

export function ArticleCover({
  cover,
  alt,
  caption,
  size = 'md',
  label,
  className,
}: {
  cover: CoverTone;
  alt: string;
  caption?: string | null;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}) {
  const aspect =
    size === 'hero'
      ? 'aspect-[21/9] sm:aspect-[2.4/1]'
      : 'aspect-[16/10]';
  const tone = TONE[cover];

  return (
    <figure className={cn(className)}>
      <div
        role="img"
        aria-label={alt}
        className={cn('relative w-full overflow-hidden', aspect, tone.bg)}
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`cover-grid-${cover}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" className={tone.rule} strokeWidth="0.6" opacity="0.45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#cover-grid-${cover})`} />
          <path
            d="M0 78% L35% 52% L55% 62% L100% 28%"
            fill="none"
            className={tone.rule}
            strokeWidth="2"
            opacity="0.55"
          />
        </svg>
        {label && (
          <p
            className={cn(
              'absolute bottom-3 left-3 font-mono-num text-[11px] font-medium uppercase tracking-[0.08em]',
              tone.ink
            )}
          >
            {label}
          </p>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-sm text-ink-faint">{caption}</figcaption>}
    </figure>
  );
}
