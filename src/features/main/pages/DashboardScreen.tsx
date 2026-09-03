import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAlert } from '@/core/components/alert/useAlert';
import { Spinner } from '@/core/components/Spinner';
import { useCurrentUser } from '@/features/auth/hooks/useAuthState';
import {
  useCompletePosttestSurveyMutation,
  useCompletePretestSurveyMutation,
  useGetJourneyDetailQuery,
} from '@/features/learning/api/learningApi';
import { usePrimarySectorDetail } from '@/features/learning/hooks/usePrimarySectorDetail';
import {
  allJourneysCompleted,
  inProgressJourney,
  nextJourney,
  pretestGateActive,
  type SectorDetail,
} from '@/features/learning/model/sectorDetail';
import { surveyIsCompleted, surveyIsConfigured } from '@/features/learning/model/sectorSurvey';
import { SectorSurveyCard } from '@/features/learning/components/SectorSurveyCard';
import { ContinueLearningCard } from '../components/ContinueLearningCard';
import { JourneyCard } from '../components/JourneyCard';

/** Padanan `dashboard_screen.dart`. */
export function DashboardScreen() {
  const user = useCurrentUser();
  const { data: detail, isLoading, isError } = usePrimarySectorDetail();

  return (
    <div className="min-h-full bg-background p-sm">
      <div className="p-sm">
        <h1 className="text-[30px] font-extrabold leading-tight text-black">
          Halo, Selamat datang kembali <span className="text-primary">{user?.name ?? ''}!</span>
        </h1>
        <p className="mt-xxs text-body-md text-ink">
          Siap belajar perlindungan konsumen hari ini?
        </p>
        <div className="h-md" />
        <SearchBarStub />
        <div className="h-lg" />
        {isLoading ? (
          <div className="pt-xxxl text-center">
            <Spinner />
          </div>
        ) : isError ? (
          <ErrorState />
        ) : (
          <DashboardBody detail={detail ?? null} />
        )}
      </div>
    </div>
  );
}

function DashboardBody({ detail }: { detail: SectorDetail | null }) {
  const navigate = useNavigate();
  const [completePretest] = useCompletePretestSurveyMutation();
  const [completePosttest] = useCompletePosttestSurveyMutation();

  if (!detail || detail.journeys.length === 0) return <EmptyState />;

  const inProgress = inProgressJourney(detail);
  const next = nextJourney(detail);

  const pretest = detail.sector.surveys.pretest;
  const showPretest = pretestGateActive(detail);

  const posttest = detail.sector.surveys.posttest;
  const showPosttest =
    allJourneysCompleted(detail) && surveyIsConfigured(posttest) && !surveyIsCompleted(posttest);

  return (
    <div className="flex flex-col items-stretch">
      {showPretest && pretest.link ? (
        <>
          <SectorSurveyCard
            title="Survei Pre-Test Sektor"
            description="Isi survei singkat ini lewat Google Form dulu untuk membuka journey pertama dan memetakan wawasanmu seputar hak konsumen."
            link={pretest.link}
            onComplete={async () => {
              await completePretest(detail.sector.slug).unwrap();
            }}
          />
          <div className="h-lg" />
        </>
      ) : null}

      {showPosttest && posttest.link ? (
        <>
          <SectorSurveyCard
            title="Survei Post-Test Sektor"
            description="Kamu sudah menyelesaikan semua journey di sektor ini — isi survei penutup lewat Google Form untuk mengukur perkembangan pemahamanmu."
            link={posttest.link}
            onComplete={async () => {
              await completePosttest(detail.sector.slug).unwrap();
            }}
          />
          <div className="h-lg" />
        </>
      ) : null}

      {inProgress ? (
        <>
          <h2 className="text-title-lg text-black">Lanjutkan Belajar</h2>
          <div className="h-sm" />
          <ContinueLearningSection journeyId={inProgress.id} />
          <div className="h-lg" />
        </>
      ) : null}

      {next && !showPretest ? (
        <>
          <h2 className="text-title-lg text-black">Perjalanan</h2>
          <div className="h-sm" />
          <JourneyCard
            journey={next}
            label={`Journey ${next.order}`}
            onTap={() => navigate(`/journey/${next.id}`)}
          />
        </>
      ) : null}
    </div>
  );
}

function ContinueLearningSection({ journeyId }: { journeyId: string }) {
  const navigate = useNavigate();
  const { data, isError } = useGetJourneyDetailQuery(journeyId);

  if (isError) return null;
  if (!data) {
    return (
      <div className="flex h-170 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <ContinueLearningCard journeyDetail={data} onTap={() => navigate(`/journey/${journeyId}`)} />
  );
}

function SearchBarStub() {
  const showAlert = useAlert();
  return (
    <button
      type="button"
      onClick={() =>
        void showAlert({
          type: 'info',
          title: 'Belum Tersedia',
          message: 'Pencarian belum tersedia.',
        })
      }
      className="flex w-full items-center gap-sm rounded-lg border border-border bg-white px-md py-sm text-left"
    >
      <Search size={20} className="text-muted" />
      <span className="truncate text-body-md text-muted">Cari bahan pembelajaran...</span>
    </button>
  );
}

function ErrorState() {
  return (
    <p className="pt-xxl text-center text-body-sm text-ink-muted">
      Gagal memuat data pembelajaran. Tarik ke bawah untuk coba lagi.
    </p>
  );
}

function EmptyState() {
  return (
    <p className="pt-xxl text-center text-body-sm text-ink-muted">
      Belum ada materi pembelajaran tersedia.
    </p>
  );
}
