import { cn } from '@/lib/format';
import type { ArticleCover as CoverTone } from '@/lib/mock/types';

const TONE: Record<CoverTone, string> = {
  slate: 'from-[#e8eaed] via-[#d5d9de] to-[#b8bec4]',
  oak: 'from-[#efe6d8] via-[#e0d0b8] to-[#c4a882]',
  peat: 'from-[#e4ebe6] via-[#cfdcd2] to-[#a8c0b0]',
  amber: 'from-[#f3e7d6] via-[#e8d4b4] to-[#d4b07a]',
};

export function ArticleCover({
  cover,
  alt,
  caption,
  size = 'md',
  className,
}: {
  cover: CoverTone;
  alt: string;
  caption?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}) {
  const aspect =
    size === 'hero'
      ? 'aspect-[21/9] sm:aspect-[2.4/1]'
      : size === 'lg'
        ? 'aspect-[16/9]'
        : size === 'sm'
          ? 'aspect-[16/10]'
          : 'aspect-[16/10]';

  return (
    <figure className={cn(className)}>
      <div
        role="img"
        aria-label={alt}
        className={cn('w-full bg-gradient-to-br', aspect, TONE[cover])}
      />
      {caption && <figcaption className="mt-2 text-sm text-ink-faint">{caption}</figcaption>}
    </figure>
  );
}
