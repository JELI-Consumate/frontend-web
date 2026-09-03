import { cn } from '@/core/lib/cn';

interface SpinnerProps {
  /** Diameter dalam px (Flutter default indicator ≈ 36, tombol pakai 20). */
  size?: number;
  /** Tebal cincin (Flutter `strokeWidth`). */
  strokeWidth?: number;
  /** Warna via `text-*`; cincin memakai `currentColor`. */
  className?: string;
}

/** Setara `CircularProgressIndicator` (indeterminate). */
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
