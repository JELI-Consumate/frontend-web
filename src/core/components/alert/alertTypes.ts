export type AppAlertType = 'success' | 'error' | 'warning' | 'info';

export interface AppAlertOptions {
  type: AppAlertType;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
}
