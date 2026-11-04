import { cn } from '@/lib/format';

/** Honest roadmap / demo status — not a marketing pill. */
export function StatusChip({
  tone = 'planned',
  children,
  className,
}: {
  tone?: 'planned' | 'demo' | 'limited';
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono-num text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted',
        className
      )}
    >
      {children ?? (tone === 'demo' ? 'Demo' : tone === 'limited' ? 'Limited' : 'Planned')}
    </span>
  );
}
