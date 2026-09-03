import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/core/components/Spinner';
import { usePrimarySectorDetail } from '@/features/learning/hooks/usePrimarySectorDetail';
import { pretestGateActive } from '@/features/learning/model/sectorDetail';
import { JourneyCard } from '../components/JourneyCard';

/** Padanan `journeys_screen.dart`. */
export function JourneysScreen() {
  const navigate = useNavigate();
  const { data: detail, isLoading, isError } = usePrimarySectorDetail();

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 flex h-56 items-center justify-center bg-background">
        <h1 className="text-title-lg text-black">Perjalanan Belajarmu</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center pt-xxxl">
          <Spinner />
        </div>
      ) : isError ? (
        <p className="p-screen pt-xxl text-center text-body-sm text-ink-muted">
          Gagal memuat daftar journey. Tarik ke bawah untuk coba lagi.
        </p>
      ) : !detail || detail.journeys.length === 0 ? (
        <p className="p-screen pt-xxl text-center text-body-sm text-ink-muted">
          Belum ada journey tersedia.
        </p>
      ) : (
        <div className="flex flex-col gap-sm p-screen">
          <p className="pb-xs text-body-sm text-ink-muted">
            {pretestGateActive(detail)
              ? 'Isi survei Pre-Test di Beranda dulu untuk membuka journey pertama.'
              : 'Selesaikan setiap journey untuk menjadi konsumen yang cerdas dan berdaya.'}
          </p>
          {detail.journeys.map((journey) => {
            const pretestLock = pretestGateActive(detail) && journey.order === 1;
            return (
              <JourneyCard
                key={journey.id}
                journey={journey}
                label={`Journey ${journey.order}`}
                forceLocked={pretestLock}
                lockReason={pretestLock ? 'Selesaikan Pre-Test dulu' : null}
                onTap={() => navigate(`/journey/${journey.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
