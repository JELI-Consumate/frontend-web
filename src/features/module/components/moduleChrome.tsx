import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/core/lib/cn';
import { Spinner } from '@/core/components/Spinner';
import { PrimaryButton } from '@/core/components/PrimaryButton';

/** Padanan `module_top_bar.dart`. */
export function ModuleTopBar({
  position,
  total,
  onBack,
}: {
  position?: number;
  total?: number;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <header className="flex h-56 shrink-0 items-center border-b border-border bg-background px-xs">
      <button
        type="button"
        aria-label="Kembali"
        onClick={onBack ?? (() => navigate(-1))}
        className="flex h-40 w-40 items-center justify-center text-ink"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="flex flex-1 justify-center">
        {position != null && total != null ? (
          <span className="rounded-pill border border-primary/30 bg-primary-soft px-md py-6 text-label-md font-bold text-primary">
            Modul {position}/{total}
          </span>
        ) : null}
      </div>
      <span className="h-40 w-40" />
    </header>
  );
}

/** Padanan `module_bottom_bar.dart`. */
export function ModuleBottomBar({
  children,
  pageCount = 1,
  pageIndex = 0,
  onDotTap,
}: {
  children: ReactNode;
  pageCount?: number;
  pageIndex?: number;
  onDotTap?: (index: number) => void;
}) {
  return (
    <div className="shrink-0 border-t border-primary/[0.15] bg-white">
      <div className="px-screen pb-[max(env(safe-area-inset-bottom),12px)] pt-sm">
        {pageCount > 1 ? (
          <div className="mb-sm flex justify-center">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={onDotTap ? () => onDotTap(i) : undefined}
                className={cn(
                  'mx-[3px] h-[6px] rounded-pill transition-all duration-fast',
                  i === pageIndex ? 'w-20 bg-primary' : 'w-6 bg-border',
                )}
              />
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/** Padanan `module_continue_button.dart`. */
export function ModuleContinueButton({
  hasNext,
  busy,
  onPressed,
}: {
  hasNext: boolean;
  busy: boolean;
  onPressed?: (() => void) | null;
}) {
  return (
    <PrimaryButton
      label={hasNext ? 'Selanjutnya' : 'Selesai'}
      trailingIcon={hasNext ? ArrowRight : Check}
      isLoading={busy}
      onPressed={onPressed}
    />
  );
}

/** Padanan `module_async_scaffold.dart`. */
export function ModuleLoadingScaffold() {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}

export function ModuleErrorScaffold({
  title,
  message,
  onBack,
}: {
  title?: string;
  message?: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <ModuleTopBar onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center gap-sm p-screen text-center">
        <p className="text-title-lg text-black">{title}</p>
        <p className="text-body-sm text-ink-muted">
          {message ?? 'Gagal memuat modul ini. Coba lagi nanti.'}
        </p>
      </div>
    </div>
  );
}
