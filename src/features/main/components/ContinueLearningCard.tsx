import { Clock } from 'lucide-react';
import { currentModule, type JourneyDetail } from '@/features/learning/model/journeyDetail';

interface ContinueLearningCardProps {
  journeyDetail: JourneyDetail;
  onTap: () => void;
}

/** Padanan `continue_learning_card.dart`. */
export function ContinueLearningCard({ journeyDetail, onTap }: ContinueLearningCardProps) {
  const current = currentModule(journeyDetail);
  if (!current) return null;

  const percent = journeyDetail.journey.progress.percent;
  const imageUrl = journeyDetail.journey.imageUrl;

  return (
    <button
      type="button"
      onClick={onTap}
      className="block w-full overflow-hidden rounded-lg border border-border bg-white text-left"
    >
      <div className="flex items-start gap-md p-md">
        {/* Cover journey rasio 2:3 (potrait) di sisi kiri; `object-contain`
            supaya rasio non-2:3 tidak ke-crop. */}
        <div className="flex aspect-[2/3] w-96 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary-soft">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <img src="/images/journey_illustration.svg" alt="" className="p-xs" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-title-md text-ink">{current.title}</p>
          <div className="mt-xxs flex items-center gap-xxs">
            <Clock size={14} className="shrink-0 text-ink-muted" />
            <span className="truncate text-body-sm text-ink-muted">
              {current.estimatedMinutes} menit tersisa
            </span>
          </div>
          <div className="mt-sm flex items-center gap-xs">
            <div className="h-[6px] flex-1 overflow-hidden rounded-pill bg-border">
              <div
                className="h-full rounded-pill bg-primary"
                style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
              />
            </div>
            <span className="text-body-sm text-ink-muted">{percent}%</span>
          </div>
        </div>
      </div>
    </button>
  );
}
