import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, CheckCircle2, Medal } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { selectTab } from '@/features/main/state/mainTabSlice';
import { BadgeAvatar } from '@/features/badges/components/BadgeAvatar';
import type { JourneyCelebrationData } from '../model/journeyCompletion';

/** Padanan `journey_celebration_screen.dart`. */
export function JourneyCelebrationScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id = '' } = useParams();
  const data = location.state as JourneyCelebrationData | null;

  if (!data) return <Navigate to={`/journey/${id}`} replace />;

  const { badge } = data;

  function goToHome() {
    dispatch(selectTab(0));
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-full bg-background">
      <header className="flex h-56 items-center bg-background px-screen">
        <span className="text-label-md text-muted">Badge</span>
      </header>
      <div className="flex flex-col items-center px-screen pb-xl pt-md">
        <p className="text-label-lg tracking-[0.6px] text-primary">PENCAPAIAN BARU!</p>
        <p className="mt-xxs text-center text-display-sm text-ink">
          Journey {data.journeyOrder} Selesai
        </p>

        <div className="relative mt-lg flex h-[200px] w-[200px] items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(233,162,59,0.35),rgba(233,162,59,0))]" />
          <span className="absolute h-[168px] w-[168px] rounded-full border-4 border-warning" />
          <BadgeAvatar badge={badge} size={148} />
          <span className="absolute right-[14px] top-[6px] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-warning text-white">
            <Star size={15} fill="currentColor" />
          </span>
          <span className="absolute bottom-[10px] left-[10px] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-warning text-white">
            <Star size={15} fill="currentColor" />
          </span>
        </div>

        <p className="mt-lg text-center text-title-lg text-black">{badge.name}</p>
        <p className="mt-xs text-center text-body-sm text-ink-muted">
          {badge.congratulationMessage ?? badge.description}
        </p>

        <div className="mt-lg w-full rounded-md border border-border bg-white p-md">
          <p className="text-title-sm text-ink">Ringkasan Journey {data.journeyOrder}</p>
          <div className="mt-sm flex gap-sm">
            <StatTile
              icon={<CheckCircle2 size={18} className="text-primary" />}
              tint="bg-primary/[0.12]"
              label="Modul Diselesaikan"
              value={`${data.modulesCompleted}/${data.modulesTotal}`}
            />
            <StatTile
              icon={<Medal size={18} className="text-warning" />}
              tint="bg-warning/[0.12]"
              label="Skor Kuis"
              value={data.quizScore == null ? '–' : `${data.quizScore}%`}
            />
          </div>
        </div>

        <div className="h-xl" />
        {badge.motivationalMessage && badge.motivationalMessage.trim().length > 0 ? (
          <p className="mb-md text-center text-body-sm text-ink-muted">{badge.motivationalMessage}</p>
        ) : null}
        {data.nextJourneyId ? (
          <PrimaryButton
            label="Lanjut ke Journey Berikutnya"
            onPressed={() =>
              navigate(`/journey/${data.nextJourneyId}`, { replace: true, state: {} })
            }
          />
        ) : null}
        <button
          type="button"
          onClick={goToHome}
          className="mt-sm px-md py-xs text-label-md font-semibold text-primary"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  tint,
  label,
  value,
}: {
  icon: ReactNode;
  tint: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-xs">
      <span className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${tint}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-label-sm text-ink-muted">{label}</p>
        <p className="text-title-md text-ink">{value}</p>
      </div>
    </div>
  );
}
