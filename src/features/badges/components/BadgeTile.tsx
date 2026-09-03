import { useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import { formatLongDateId } from '@/core/lib/dateFormat';
import { BadgeAvatar } from './BadgeAvatar';
import { BadgeDetailSheet } from './BadgeDetailSheet';
import type { Badge } from '../model/badge';

/** Padanan `badge_tile.dart`. */
export function BadgeTile({ badge }: { badge: Badge }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-start gap-md rounded-lg border border-border bg-white p-md text-left"
      >
        <BadgeAvatar badge={badge} />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'line-clamp-2 text-title-md',
              badge.earned ? 'text-ink' : 'text-ink-muted',
            )}
          >
            {badge.name}
          </p>
          <p className="mt-xxs line-clamp-2 text-body-sm text-ink-muted">{badge.description}</p>
          <div className="mt-xs">
            {badge.earned ? (
              <span className="flex items-center gap-xxs">
                <CheckCircle2 size={14} className="text-success" />
                <span className="truncate text-body-sm font-semibold text-success">
                  {badge.earnedAt
                    ? `Diraih ${formatLongDateId(new Date(badge.earnedAt))}`
                    : 'Sudah diraih'}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-xxs">
                <Lock size={14} className="text-ink-muted" />
                <span className="truncate text-body-sm text-ink-muted">
                  Selesaikan journey terkait untuk meraih ini
                </span>
              </span>
            )}
          </div>
        </div>
      </button>
      {open ? <BadgeDetailSheet badge={badge} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
