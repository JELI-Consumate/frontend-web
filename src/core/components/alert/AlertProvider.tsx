import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, AlertCircle, TriangleAlert, Info, type LucideProps } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { AlertContext, type ShowAlert } from './AlertContext';
import type { AppAlertOptions, AppAlertType } from './alertTypes';

interface Visual {
  Icon: ComponentType<LucideProps>;
  color: string;
  soft: string;
}

const VISUALS: Record<AppAlertType, Visual> = {
  success: { Icon: Check, color: 'text-success', soft: 'bg-success-soft' },
  error: { Icon: AlertCircle, color: 'text-danger', soft: 'bg-danger-soft' },
  warning: { Icon: TriangleAlert, color: 'text-warning', soft: 'bg-warning-soft' },
  info: { Icon: Info, color: 'text-primary', soft: 'bg-primary-soft' },
};

interface Pending extends AppAlertOptions {
  resolve: () => void;
}

/**
 * Setara `showAppAlert` di `frontend-android/lib/core/widgets/app_alert_dialog.dart`.
 * Menampung antrean dialog (satu tampil, sisanya menunggu) dan mengembalikan
 * Promise yang selesai saat dialog ditutup.
 */
export function AlertProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Pending | null>(null);
  const queueRef = useRef<Pending[]>([]);

  const showAlert = useCallback<ShowAlert>((options) => {
    return new Promise<void>((resolve) => {
      const pending: Pending = { ...options, resolve };
      setCurrent((existing) => {
        if (existing) {
          queueRef.current.push(pending);
          return existing;
        }
        return pending;
      });
    });
  }, []);

  const close = useCallback((pending: Pending, callback?: () => void) => {
    callback?.();
    pending.resolve();
    const next = queueRef.current.shift() ?? null;
    setCurrent(next);
  }, []);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {current ? <AlertDialog pending={current} onClose={close} /> : null}
    </AlertContext.Provider>
  );
}

function AlertDialog({
  pending,
  onClose,
}: {
  pending: Pending;
  onClose: (pending: Pending, callback?: () => void) => void;
}) {
  const { type, title, message, confirmLabel = 'OK', onConfirm, cancelLabel, onCancel } = pending;
  const visual = VISUALS[type];
  const barrierDismissible = cancelLabel == null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && barrierDismissible) onClose(pending);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [barrierDismissible, onClose, pending]);

  return createPortal(
    <div
      role="presentation"
      onMouseDown={barrierDismissible ? () => onClose(pending) : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-lg py-xl"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex w-full max-w-app flex-col items-center rounded-xl bg-white px-lg pb-lg pt-xl shadow-card"
      >
        <div
          className={`flex h-72 w-72 items-center justify-center rounded-full ${visual.soft}`}
        >
          <visual.Icon size={34} className={visual.color} />
        </div>
        <h2 className="mt-md text-center text-title-lg text-black">{title}</h2>
        {message ? (
          <p className="mt-xs text-center text-body-sm text-ink-muted">{message}</p>
        ) : null}
        <div className="mt-lg w-full">
          <PrimaryButton
            label={confirmLabel}
            trailingIcon={null}
            onPressed={() => onClose(pending, onConfirm)}
          />
        </div>
        {cancelLabel ? (
          <button
            type="button"
            onClick={() => onClose(pending, onCancel)}
            className="mt-xxs px-md py-xs text-label-md font-semibold text-primary"
          >
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
