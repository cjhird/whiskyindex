import { cn, formatPct } from '@/lib/format';

export function ChangeBadge({
  value,
  size = 'md',
  showSign = true,
}: {
  value: number;
  size?: 'sm' | 'md';
  showSign?: boolean;
}) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono-num font-medium',
        size === 'sm' ? 'rounded px-1.5 py-0.5 text-[11px]' : 'rounded-md px-2 py-1 text-xs',
        up ? 'ticker-chip-up' : 'ticker-chip-down'
      )}
    >
      <span aria-hidden>{up ? '▲' : '▼'}</span>
      {showSign ? formatPct(value) : `${Math.abs(value).toFixed(2)}%`}
    </span>
  );
}

export function ChangeText({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('font-mono-num', value >= 0 ? 'ticker-up' : 'ticker-down', className)}>
      {formatPct(value)}
    </span>
  );
}
