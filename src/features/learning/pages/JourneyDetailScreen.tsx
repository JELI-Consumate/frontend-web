import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BookText } from 'lucide-react';
import { TopBar } from '@/core/components/TopBar';
import { Spinner } from '@/core/components/Spinner';
import { isCompleted } from '@/core/model/learningStatus';
import { useGetBadgesQuery } from '@/features/badges/api/badgeApi';
import { useGetJourneyDetailQuery } from '../api/learningApi';
import { usePrimarySectorDetail } from '../hooks/usePrimarySectorDetail';
import {
  completedModuleCount,
  currentModule,
  type JourneyDetail,
} from '../model/journeyDetail';
import { computeJourneyCelebration } from '../model/journeyCompletion';
import { ModuleRow } from '../components/ModuleRow';

/** Padanan `journey_detail_screen.dart`. */
export function JourneyDetailScreen() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? {}) as { chainCompleted?: boolean; wasCompletedBefore?: boolean };

  const journeyQuery = useGetJourneyDetailQuery(id);
  const badgesQuery = useGetBadgesQuery(undefined, { skip: !navState.chainCompleted });
  const sector = usePrimarySectorDetail();

  const celebrationHandled = useRef(false);

  // Setara akhir `_openModule`: sesudah rantai modul, cek "journey baru tuntas".
  useEffect(() => {
    if (!navState.chainCompleted || celebrationHandled.current) return;
    const journeyDetail = journeyQuery.data;
    if (!journeyDetail || journeyQuery.isFetching) return;
    if (badgesQuery.isFetching || sector.isLoading) return;

    celebrationHandled.current = true;
    const data = computeJourneyCelebration({
      journeyId: id,
      wasCompletedBefore: navState.wasCompletedBefore ?? false,
      refreshed: journeyDetail,
      badges: badgesQuery.data ?? [],
      sectorDetail: sector.data,
    });

    if (data) {
      navigate(`/journey/${id}/celebration`, { replace: true, state: data });
    } else {
      navigate(`/journey/${id}`, { replace: true, state: {} });
    }
  }, [
    navState.chainCompleted,
    navState.wasCompletedBefore,
    id,
    journeyQuery.data,
    journeyQuery.isFetching,
    badgesQuery.data,
    badgesQuery.isFetching,
    sector.data,
    sector.isLoading,
    navigate,
  ]);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <TopBar />
      {journeyQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : journeyQuery.isError || !journeyQuery.data ? (
        <div className="p-screen pt-xxl text-center">
          <p className="text-body-sm text-ink-muted">
            Gagal memuat journey ini. Coba lagi nanti.
          </p>
          <button
            type="button"
            onClick={() => void journeyQuery.refetch()}
            className="mt-sm px-md py-xs text-label-md font-semibold text-primary"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <JourneyDetailBody
          detail={journeyQuery.data}
          onOpenModule={(moduleId) =>
            navigate(`/journey/${id}/module/${moduleId}`, {
              state: {
                wasCompletedBefore: isCompleted(journeyQuery.data!.journey.progress.status),
                moduleIds: journeyQuery.data!.modules.map((m) => m.id),
              },
            })
          }
        />
      )}
    </div>
  );
}

function JourneyDetailBody({
  detail,
  onOpenModule,
}: {
  detail: JourneyDetail;
  onOpenModule: (moduleId: string) => void;
}) {
  const journey = detail.journey;
  const current = currentModule(detail);
  const completed = completedModuleCount(detail);
  const percent = journey.progress.percent;

  return (
    <div className="px-screen pb-xl pt-0">
      <span className="inline-flex items-center gap-xxs rounded-pill bg-primary px-sm py-xxs text-label-md text-white">
        <BookText size={14} />
        Journey {journey.order}
      </span>
      <h1 className="mt-sm text-display-sm text-primary">{journey.title}</h1>
      {journey.description ? (
        <p className="mt-xs text-body-sm text-ink-muted">{journey.description}</p>
      ) : null}

      <div className="mt-lg rounded-md border border-border bg-white p-md">
        <div className="flex items-center">
          <span className="flex-1 truncate text-title-md text-ink">Progres Belajar</span>
          <span className="text-title-md text-primary">
            {completed}/{detail.modules.length}
          </span>
        </div>
        <div className="mt-sm h-[8px] overflow-hidden rounded-pill bg-border">
          <div
            className="h-full rounded-pill bg-primary"
            style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          />
        </div>
        <p className="mt-xs text-body-sm text-ink-muted">
          Selesaikan semua langkah untuk membuka simulasi.
        </p>
      </div>

      <div className="mt-lg flex flex-col gap-sm">
        {detail.modules.map((module) => (
          <ModuleRow
            key={module.id}
            module={module}
            isCurrent={current?.id === module.id}
            onTap={() => onOpenModule(module.id)}
          />
        ))}
      </div>
    </div>
  );
}
