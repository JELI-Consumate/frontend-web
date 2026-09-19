import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Mail } from 'lucide-react';
import { AppTextField } from '@/core/components/AppTextField';
import { Spinner } from '@/core/components/Spinner';

interface DeleteAccountModalProps {
  email: string;
  onClose: () => void;
  onConfirm: () => void;
  busy: boolean;
}

export function DeleteAccountModal({ email, onClose, onConfirm, busy }: DeleteAccountModalProps) {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSubmit = value === email && !busy;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-screen"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-lg shadow-card"
      >
        <div className="flex items-center gap-xs text-danger">
          <Trash2 size={24} />
          <h2 className="text-title-lg font-bold">Hapus Akun</h2>
        </div>
        
        <div className="mt-md space-y-sm text-body-md text-ink-muted">
          <p>
            Tindakan ini <strong>permanen dan tidak dapat dibatalkan</strong>. Semua progres belajar, sertifikat, dan data akunmu akan dihapus selamanya.
          </p>
          <p>
            Untuk melanjutkan, silakan ketik emailmu di bawah ini:
            <br />
            <strong className="text-ink">{email}</strong>
          </p>
        </div>
        
        <div className="mt-lg">
          <AppTextField
            value={value}
            onChange={setValue}
            hintText="Ketik emailmu..."
            disabled={busy}
            icon={Mail}
          />
        </div>
        
        <div className="mt-xl flex flex-col gap-sm">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onConfirm}
            className="inline-flex w-full items-center justify-center gap-xs rounded-pill bg-danger px-lg py-sm text-label-lg text-white disabled:opacity-50 transition-opacity"
          >
            {busy && <Spinner size={16} strokeWidth={2} className="text-white" />}
            Ya, Hapus Akun Saya
          </button>
          
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="w-full px-md py-xs text-label-md font-semibold text-ink-muted disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
