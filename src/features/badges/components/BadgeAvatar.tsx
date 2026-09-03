import { useState } from 'react';
import { Award } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import type { Badge } from '../model/badge';

/** Padanan `badge_avatar.dart`. */
export function BadgeAvatar({ badge, size = 56 }: { badge: Badge; size?: number }) {
  const [imgOk, setImgOk] = useState(true);
  const showImg = badge.iconUrl != null && badge.iconUrl.length > 0 && imgOk;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        badge.earned ? 'bg-primary-soft' : 'bg-border opacity-50',
      )}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        <img
          src={badge.iconUrl!}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImgOk(false)}
        />
      ) : (
        <Award
          size={Math.round(size * 0.5)}
          className={badge.earned ? 'text-primary' : 'text-ink-muted'}
        />
      )}
    </div>
  );
}
