import type { ComponentType } from 'react';
import { ArrowRight, type LucideProps } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import { Spinner } from './Spinner';

interface PrimaryButtonProps {
  label: string;
  onPressed?: (() => void) | null;
  /** `undefined` -> panah (default Flutter). `null` -> tanpa ikon. */
  trailingIcon?: ComponentType<LucideProps> | null;
  isLoading?: boolean;
  expand?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

/** Setara `frontend-android/lib/core/widgets/primary_button.dart` (FilledButton). */
export function PrimaryButton({
  label,
  onPressed,
  trailingIcon = ArrowRight,
  isLoading = false,
  expand = true,
  type = 'button',
  className,
}: PrimaryButtonProps) {
  const enabled = onPressed != null && !isLoading;
  const TrailingIcon = trailingIcon;

  return (
    <button
      type={type}
      disabled={!enabled}
      onClick={enabled ? () => onPressed?.() : undefined}
      className={cn(
        'inline-flex min-h-[54px] items-center justify-center gap-xs rounded-md px-lg',
        'text-label-lg text-white transition-colors duration-fast',
        enabled ? 'bg-primary shadow-button hover:bg-primary-pressed' : 'bg-muted',
        expand && 'w-full',
        className,
      )}
    >
      {isLoading ? (
        <Spinner size={20} strokeWidth={2.4} className="text-white" />
      ) : (
        <>
          <span className="min-w-0 truncate">{label}</span>
          {TrailingIcon ? <TrailingIcon size={18} className="shrink-0" /> : null}
        </>
      )}
    </button>
  );
}
