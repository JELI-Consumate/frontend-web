import { cn } from '@/core/lib/cn';

interface SpinnerProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Spinner({ size = 36, strokeWidth = 3, className }: SpinnerProps) {
  return (
    <span
      role="progressbar"
      aria-label="Memuat"
      className={cn('spinner align-middle text-primary', className)}
      style={{ width: size, height: size, borderWidth: strokeWidth }}
    />
  );
}
