import { cn } from '@/core/lib/cn';
import { Spinner } from './Spinner';

interface GoogleButtonProps {
  onPressed?: (() => void) | null;
  label?: string;
  isLoading?: boolean;
}

/** Setara `frontend-android/lib/core/widgets/google_button.dart`. */
export function GoogleButton({ onPressed, label = 'Google', isLoading = false }: GoogleButtonProps) {
  const enabled = onPressed != null && !isLoading;

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={enabled ? () => onPressed?.() : undefined}
      className={cn(
        'inline-flex min-h-[54px] w-full items-center justify-center gap-sm rounded-md',
        'border-[1.2px] border-border bg-white px-lg transition-colors duration-fast',
        enabled ? 'hover:bg-background' : 'opacity-60',
      )}
    >
      {isLoading ? (
        <Spinner size={20} strokeWidth={2.4} className="text-primary" />
      ) : (
        <>
          <img src="/images/google_logo.svg" alt="" aria-hidden className="h-20 w-20" />
          <span className="text-label-lg text-ink">{label}</span>
        </>
      )}
    </button>
  );
}
