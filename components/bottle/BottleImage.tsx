import type { Bottle } from '@/lib/mock/types';
import { bottleVisualTone } from '@/lib/mock/bottles';
import { cn } from '@/lib/format';

const TONE: Record<ReturnType<typeof bottleVisualTone>, string> = {
  amber: 'from-[#c4a574]/via-[#8b6914]/to-[#3d2a0f]',
  peat: 'from-[#6b7c6e]/via-[#3a4a3c]/to-[#1a221c]',
  oak: 'from-[#b8956a]/via-[#6e4a28]/to-[#2a1810]',
  slate: 'from-[#9aa3ad]/via-[#4a5560]/to-[#1c2228]',
};

/** Illustrative silhouette — not product photography */
export function BottleImage({
  bottle,
  className,
  size = 'lg',
}: {
  bottle: Bottle;
  className?: string;
  size?: 'sm' | 'lg';
}) {
  const tone = bottleVisualTone(bottle);
  return (
    <div
      className={cn(
        'relative flex items-end justify-center overflow-hidden bg-surface-muted',
        size === 'lg' ? 'h-56 w-40 sm:h-72 sm:w-52' : 'h-16 w-12',
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b opacity-90',
          TONE[tone]
        )}
      />
      <svg
        viewBox="0 0 80 200"
        className={cn(
          'relative z-[1] drop-shadow-sm',
          size === 'lg' ? 'h-[85%] w-auto' : 'h-[90%] w-auto'
        )}
      >
        <path
          d="M32 8h16c2 0 3 1 3 3v14c0 4 2 7 5 10l4 4c4 4 6 9 6 15v118c0 10-8 18-18 18H32c-10 0-18-8-18-18V54c0-6 2-11 6-15l4-4c3-3 5-6 5-10V11c0-2 1-3 3-3z"
          fill="rgba(255,255,255,0.18)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
        />
        <rect x="34" y="4" width="12" height="8" rx="1" fill="rgba(255,255,255,0.4)" />
        {size === 'lg' && (
          <text
            x="40"
            y="110"
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            style={{ fontSize: 7, fontFamily: 'var(--font-sans)' }}
          >
            {bottle.brand.slice(0, 10)}
          </text>
        )}
      </svg>
    </div>
  );
}
