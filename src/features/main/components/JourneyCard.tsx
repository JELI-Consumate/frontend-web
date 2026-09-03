import { Lock, Clock } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import type { Journey } from '@/features/learning/model/journey';

interface JourneyCardProps {
  journey: Journey;
  label: string;
  onTap: () => void;
  forceLocked?: boolean;
  lockReason?: string | null;
}

/** Padanan `journey_card.dart`. */
export function JourneyCard({
  journey,
  label,
  onTap,
  forceLocked = false,
  lockReason,
}: JourneyCardProps) {
  const isLocked = forceLocked || !journey.isUnlocked;

  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onTap}
      disabled={isLocked}
      className={cn(
        'block w-full overflow-hidden rounded-lg border border-border bg-white text-left',
        isLocked && 'opacity-50',
      )}
    >
      <div className="flex items-start gap-md p-md">
        <Thumbnail imageUrl={journey.imageUrl} locked={isLocked} />
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-pill bg-primary-soft px-sm py-[3px] text-label-md font-bold text-primary">
            {label}
          </span>
          <p className="mt-xs line-clamp-2 text-title-md text-ink">{journey.title}</p>
          <div className="mt-xs">
            {isLocked ? (
              <div className="flex items-center gap-xxs">
                <Lock size={14} className="shrink-0 text-ink-muted" />
                <span className="truncate text-body-sm text-ink-muted">
                  {lockReason ?? 'Selesaikan journey sebelumnya'}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-xxs">
                  <Clock size={14} className="text-ink-muted" />
                  <span className="text-body-sm text-ink-muted">
                    {journey.modulesCount} Materi
                  </span>
                </div>
                <div className="h-sm" />
                <ProgressBar percent={journey.progress.percent} />
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function Thumbnail({ imageUrl, locked }: { imageUrl: string | null; locked: boolean }) {
  return (
    <div className="flex h-92 w-76 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary-soft">
      {locked ? (
        <Lock className="text-ink-muted" />
      ) : imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <img src="/images/journey_illustration.svg" alt="" className="p-xs" />
      )}
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-xs">
      <div className="h-[6px] flex-1 overflow-hidden rounded-pill bg-border">
        <div
          className="h-full rounded-pill bg-primary"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
      <span className="text-body-sm text-ink-muted">{percent}%</span>
    </div>
  );
}
