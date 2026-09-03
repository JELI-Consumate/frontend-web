import { Award, AlertCircle } from 'lucide-react';
import { Spinner } from '@/core/components/Spinner';
import { BadgeTile } from '../components/BadgeTile';
import { useSectorBadges } from '../hooks/useSectorBadges';
import type { Badge } from '../model/badge';

/** Padanan `badges_screen.dart` (tab "Pencapaian"). */
export function BadgesScreen() {
  const { data, isLoading, isError } = useSectorBadges();

  return (
    <div className="min-h-full bg-background">
      <header className="flex h-56 items-center justify-center bg-background">
        <h1 className="text-title-lg text-black">Pencapaian</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center pt-xxxl">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-sm p-screen pt-xxl text-center">
          <AlertCircle size={40} className="text-muted" />
          <p className="text-body-sm text-ink-muted">
            Gagal memuat lencana. Tarik ke bawah untuk coba lagi.
          </p>
        </div>
      ) : !data || data.length === 0 ? (
        <p className="p-screen pt-xxl text-center text-body-sm text-ink-muted">
          Belum ada lencana tersedia di sektor ini.
        </p>
      ) : (
        <div className="flex flex-col gap-sm p-screen">
          <SummaryCard badges={data} />
          <div className="h-lg" />
          {data.map((badge) => (
            <BadgeTile key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ badges }: { badges: Badge[] }) {
  const earnedCount = badges.filter((b) => b.earned).length;
  const percent = badges.length === 0 ? 0 : Math.round((earnedCount / badges.length) * 100);

  return (
    <div className="flex items-center gap-md rounded-lg bg-primary p-md">
      <Award size={36} className="text-white" />
      <div className="min-w-0 flex-1">
        <p className="text-title-md text-white">
          {earnedCount}/{badges.length} Lencana diraih
        </p>
        <div className="mt-xs h-[6px] overflow-hidden rounded-pill bg-white/25">
          <div className="h-full rounded-pill bg-white" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
