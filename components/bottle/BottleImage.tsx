import type { Bottle } from '@/lib/mock/types';
import { bottleVisualTone } from '@/lib/mock/bottles';
import { cn } from '@/lib/format';

const TONE: Record<ReturnType<typeof bottleVisualTone>, { from: string; via: string; to: string }> = {
  amber: { from: '#c4a574', via: '#8b6914', to: '#3d2a0f' },
  peat: { from: '#6b7c6e', via: '#3a4a3c', to: '#1a221c' },
  oak: { from: '#b8956a', via: '#6e4a28', to: '#2a1810' },
  slate: { from: '#9aa3ad', via: '#4a5560', to: '#1c2228' },
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
  const colors = TONE[tone];
  const meta = [
    bottle.ageYears != null ? `${bottle.ageYears}yo` : 'NAS',
    bottle.vintageYear ? String(bottle.vintageYear) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-end overflow-hidden bg-surface-muted',
        size === 'lg' ? 'h-56 w-40 sm:h-72 sm:w-52' : 'h-16 w-12',
        className
      )}
      role="img"
      aria-label={`Illustrative bottle mark for ${bottle.name}`}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(180deg, ${colors.from} 0%, ${colors.via} 45%, ${colors.to} 100%)`,
        }}
      />
      <svg
        viewBox="0 0 80 200"
        className={cn(
          'relative z-[1] drop-shadow-sm',
          size === 'lg' ? 'mb-6 h-[72%] w-auto' : 'mb-1 h-[85%] w-auto'
        )}
        aria-hidden
      >
        <path
          d="M32 8h16c2 0 3 1 3 3v14c0 4 2 7 5 10l4 4c4 4 6 9 6 15v118c0 10-8 18-18 18H32c-10 0-18-8-18-18V54c0-6 2-11 6-15l4-4c3-3 5-6 5-10V11c0-2 1-3 3-3z"
          fill="rgba(255,255,255,0.18)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
        />
        <rect x="34" y="4" width="12" height="8" rx="1" fill="rgba(255,255,255,0.4)" />
        {size === 'lg' && (
          <>
            <text
              x="40"
              y="100"
              textAnchor="middle"
              fill="rgba(255,255,255,0.85)"
              style={{ fontSize: 7, fontFamily: 'var(--font-sans)' }}
            >
              {bottle.brand.slice(0, 12)}
            </text>
            <text
              x="40"
              y="112"
              textAnchor="middle"
              fill="rgba(255,255,255,0.65)"
              style={{ fontSize: 5.5, fontFamily: 'var(--font-mono)' }}
            >
              {meta}
            </text>
          </>
        )}
      </svg>
      {size === 'lg' && (
        <p className="relative z-[1] mb-3 px-2 text-center font-mono-num text-[10px] uppercase tracking-[0.08em] text-white/40">
          Illustrative
        </p>
      )}
    </div>
  );
}
