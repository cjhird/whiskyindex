import { cn } from '@/lib/format';
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

export function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn('label-caps mb-1.5 block', className)}>{children}</span>;
}

export function TextField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('field', className)} {...props} />;
}

export function SelectField({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('field', className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </label>
  );
}
