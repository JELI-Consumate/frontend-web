import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { formatLongDateId } from '@/core/lib/dateFormat';
import { BadgeAvatar } from './BadgeAvatar';
import type { Badge } from '../model/badge';

/** Padanan `badge_detail_sheet.dart` (`showBadgeDetailSheet`). */
export function BadgeDetailSheet({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const earnedLabel = badge.earnedAt
    ? `Diraih ${formatLongDateId(new Date(badge.earnedAt))}`
    : 'Sudah diraih';
  const hasText = (v: string | null) => v != null && v.trim().length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-app overflow-y-auto rounded-t-xl bg-white px-screen pb-lg pt-sm"
      >
        <div className="mx-auto h-[4px] w-40 rounded-pill bg-border" />
        <div className="mt-md flex flex-col items-stretch">
          <div className="flex justify-center">
            <BadgeAvatar badge={badge} size={96} />
          </div>
          <h2 className="mt-md text-center text-title-lg text-black">{badge.name}</h2>

          <div className="mt-xs flex items-center justify-center gap-xxs">
            {badge.earned ? (
              <>
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-body-sm font-semibold text-success">{earnedLabel}</span>
              </>
            ) : (
              <>
                <Lock size={14} className="text-ink-muted" />
                <span className="text-body-sm text-ink-muted">
                  Selesaikan journey terkait untuk meraih ini
                </span>
              </>
            )}
          </div>

          <div className="mt-lg">
            <Section label="Deskripsi Badge" body={badge.description} />
          </div>
          {badge.earned && hasText(badge.congratulationMessage) ? (
            <div className="mt-md">
              <Section label="Pesan Saat Diraih" body={badge.congratulationMessage!} />
            </div>
          ) : null}
          {badge.earned && hasText(badge.motivationalMessage) ? (
            <div className="mt-md">
              <Section label="Pesan Motivasi" body={badge.motivationalMessage!} />
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="mt-lg px-md py-xs text-label-md font-semibold text-primary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col items-stretch">
      <p className="text-label-sm uppercase text-ink-muted">{label}</p>
      <p className="mt-xxs text-justify text-body-md text-ink">{body}</p>
    </div>
  );
}
