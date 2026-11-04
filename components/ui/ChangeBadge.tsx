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
        size === 'sm' ? 'text-sm' : 'text-sm',
        up ? 'ticker-chip-up' : 'ticker-chip-down'
      )}
    >
      <span aria-hidden className="text-[0.65em]">
        {up ? '▲' : '▼'}
      </span>
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
