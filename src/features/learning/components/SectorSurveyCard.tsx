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
    const win = window.open(link, '_blank', 'noopener,noreferrer');
    if (win) {
      setOpened(true);
    } else {
      void showAlert({
        type: 'error',
        title: 'Gagal Membuka Form',
        message: 'Tidak bisa membuka link survei. Coba lagi.',
      });
    }
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
