import { useState } from 'react';
import { ClipboardList, ExternalLink } from 'lucide-react';
import { isApiError } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { Spinner } from '@/core/components/Spinner';

interface SectorSurveyCardProps {
  title: string;
  description: string;
  link: string;
  onComplete: () => Promise<void>;
}

/** Padanan `sector_survey_card.dart`. */
export function SectorSurveyCard({ title, description, link, onComplete }: SectorSurveyCardProps) {
  const showAlert = useAlert();
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);

  function open() {
    // Jangan pakai fitur 'noopener' di sini: browser modern (Chrome/Firefox) selalu
    // mengembalikan null dari window.open() ketika 'noopener' dipakai, walau tab-nya
    // berhasil terbuka -- itu membuat pengecekan `if (win)` di bawah selalu gagal.
    // Solusinya: buka tanpa 'noopener', lalu putus referensi opener secara manual
    // supaya tetap aman dari reverse-tabnabbing tapi return value-nya valid.
    const win = window.open(link, '_blank');
    if (win) {
      win.opener = null;
      setOpened(true);
      return;
    }

    // window.open sering gagal (return null) di dalam WebView -- fallback ke
    // klik anchor asli, yang biasanya tetap ditangani WebView lewat intent
    // eksternal walau window.open() tidak.
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setOpened(true);
  }

  async function confirm() {
    setBusy(true);
    try {
      await onComplete();
    } catch (error) {
      if (isApiError(error)) {
        void showAlert({
          type: 'error',
          title: 'Gagal Menandai Selesai',
          message: error.message,
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-primary-soft p-md">
      <div className="flex items-center gap-xs">
        <ClipboardList size={20} className="text-primary" />
        <span className="flex-1 text-title-md text-primary">{title}</span>
      </div>
      <p className="mt-xs text-justify text-body-sm text-ink-muted">{description}</p>
      <div className="h-sm" />
      <PrimaryButton
        label="Buka Google Form"
        trailingIcon={ExternalLink}
        onPressed={busy ? null : open}
      />
      {opened ? (
        <div className="mt-xxs flex justify-center">
          <button
            type="button"
            disabled={busy}
            onClick={() => void confirm()}
            className="px-md py-xs text-label-md font-semibold text-primary disabled:opacity-50"
          >
            {busy ? <Spinner size={16} strokeWidth={2} /> : 'Saya Sudah Mengisi'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
