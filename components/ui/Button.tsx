import { cn } from '@/lib/format';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost';

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', className)}
      {...props}
    />
  );
}
