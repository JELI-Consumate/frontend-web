import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { baseApi } from '@/api/baseApi';
import { useGetJourneyDetailQuery } from '@/features/learning/api/learningApi';
import { useGetModuleQuery } from '../api/moduleApi';
import { ModuleBottomBar, ModuleErrorScaffold, ModuleLoadingScaffold, ModuleTopBar } from '../components/moduleChrome';
import type { ModulePageNav } from '../components/modulePageNav';
import type { ModuleDetail } from '../model/moduleDetail';
import type { ModulePage } from '../model/modulePage';
import { ArticleModuleScreen } from './ArticleModuleScreen';
import { VideoModuleScreen } from './VideoModuleScreen';
import { QuizModuleScreen } from './QuizModuleScreen';
import { SimulationModuleScreen } from './SimulationModuleScreen';
import { ReflectionModuleScreen } from './ReflectionModuleScreen';

/** Padanan `module_screen.dart` (ModuleScreen + _ModuleContentRouter). */
export function ModuleScreen() {
  const { journeyId = '', moduleId = '' } = useParams();
  const navigate = useNavigate();
  const { data: module, isError } = useGetModuleQuery(moduleId);
  const { data: journeyDetail } = useGetJourneyDetailQuery(journeyId);

  const moduleIds = useMemo(
    () => journeyDetail?.modules.map((m) => m.id) ?? null,
    [journeyDetail],
  );

  if (isError) {
    return <ModuleErrorScaffold onBack={() => navigate(`/journey/${journeyId}`, { replace: true })} />;
  }
  if (!module) return <ModuleLoadingScaffold />;

  return (
    <ContentRouter
      key={moduleId}
      journeyId={journeyId}
      module={module}
      moduleIds={moduleIds}
    />
  );
}

function ContentRouter({
  journeyId,
  module,
  moduleIds,
}: {
  journeyId: string;
  module: ModuleDetail;
  moduleIds: string[] | null;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const pages = module.pages;

  const [currentPage, setCurrentPage] = useState(0);
  // Slot DOM tempat halaman aktif mem-`portal` footer-nya (mode chrome hoisted).
  // Callback ref supaya pages re-render sekali begitu slot terpasang.
  const [footerSlot, setFooterSlot] = useState<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pageScrollRefs = useRef<Array<HTMLDivElement | null>>([]);

  const modulePosition = useMemo(() => {
    if (!moduleIds) return undefined;
    const i = moduleIds.indexOf(module.id);
    return i === -1 ? undefined : i + 1;
  }, [moduleIds, module.id]);
  const moduleTotal = moduleIds?.length;
  const nextModuleId = useMemo(() => {
    if (!moduleIds) return null;
    const i = moduleIds.indexOf(module.id);
    return i === -1 || i + 1 >= moduleIds.length ? null : moduleIds[i + 1]!;
  }, [moduleIds, module.id]);

  const goToPage = useCallback((target: number) => {
    // Halaman tujuan selalu mulai dari atas (bukan lanjut dari posisi scroll
    // halaman sebelumnya).
    pageScrollRefs.current[target]?.scrollTo({ top: 0 });
    const track = trackRef.current;
    if (track && track.clientWidth > 0) {
      track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
    }
    setCurrentPage(target);
  }, []);

  // Tombol back modul -> selalu ke detail journey (padanan `Navigator.pop` ke
  // `JourneyDetailScreen` di Android). `navigate(-1)` tidak dipakai karena mati
  // saat modul dibuka langsung (refresh / deep link / notifikasi).
  const goBack = useCallback(
    () => navigate(`/journey/${journeyId}`, { replace: true }),
    [navigate, journeyId],
  );

  const finishModule = useCallback(() => {
    // Setara `ref.invalidate(journeyDetailProvider); ref.invalidate(primarySectorDetailProvider)`
    // (plus badges) yang Flutter jalankan tiap iterasi rantai modul.
    dispatch(baseApi.util.invalidateTags(['JourneyDetail', 'SectorDetail', 'Badges']));
    const prevState = (location.state ?? {}) as Record<string, unknown>;
    if (nextModuleId) {
      navigate(`/journey/${journeyId}/module/${nextModuleId}`, {
        replace: true,
        state: prevState,
      });
    } else {
      navigate(`/journey/${journeyId}`, {
        replace: true,
        state: { chainCompleted: true, wasCompletedBefore: prevState['wasCompletedBefore'] ?? false },
      });
    }
  }, [dispatch, nextModuleId, navigate, journeyId, location.state]);

  const handleAdvance = useCallback(
    (fromIndex: number, pageCount: number) => {
      if (fromIndex < pageCount - 1) {
        goToPage(fromIndex + 1);
        return;
      }
      finishModule();
    },
    [goToPage, finishModule],
  );

  const activePage = Math.min(currentPage, Math.max(0, pages.length - 1));

  const navFor = useCallback(
    (index: number, pageCount: number): ModulePageNav => {
      const hoisted = pageCount > 1;
      return {
        modulePosition,
        moduleTotal,
        pageCount,
        pageIndex: index,
        activePageIndex: activePage,
        onDotTap: hoisted ? goToPage : undefined,
        hasNext: index < pageCount - 1 || nextModuleId != null,
        onAdvance: () => handleAdvance(index, pageCount),
        onBack: goBack,
        chromeHoisted: hoisted,
        footerSlot: hoisted ? footerSlot : null,
      };
    },
    [modulePosition, moduleTotal, activePage, goToPage, nextModuleId, handleAdvance, goBack, footerSlot],
  );

  if (pages.length === 0) {
    return (
      <ModuleErrorScaffold
        title={module.title}
        message="Modul ini belum punya konten."
        onBack={goBack}
      />
    );
  }

  if (pages.length === 1) {
    return renderPage(pages[0]!, navFor(0, 1), module);
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <ModuleTopBar position={modulePosition} total={moduleTotal} onBack={goBack} />
      <div className="min-h-0 flex-1">
        <div
          ref={trackRef}
          onScroll={() => {
            const track = trackRef.current;
            if (!track || track.clientWidth === 0) return;
            const next = Math.round(track.scrollLeft / track.clientWidth);
            if (next !== currentPage) setCurrentPage(next);
          }}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        >
          {pages.map((page, i) => (
            <div
              key={page.id}
              ref={(el) => {
                pageScrollRefs.current[i] = el;
              }}
              className="h-full w-full flex-shrink-0 snap-center overflow-y-auto overscroll-contain"
            >
              {renderPage(page, navFor(i, pages.length), module)}
            </div>
          ))}
        </div>
      </div>
      <ModuleBottomBar pageCount={pages.length} pageIndex={activePage} onDotTap={goToPage}>
        <div ref={setFooterSlot} />
      </ModuleBottomBar>
    </div>
  );
}

function renderPage(page: ModulePage, nav: ModulePageNav, module: ModuleDetail) {
  switch (page.content.kind) {
    case 'video':
      return <VideoModuleScreen module={module} page={page} nav={nav} />;
    case 'article':
      return <ArticleModuleScreen module={module} page={page} nav={nav} />;
    case 'quiz':
      return <QuizModuleScreen page={page} nav={nav} moduleTitle={module.title} />;
    case 'simulation':
      return <SimulationModuleScreen module={module} page={page} nav={nav} />;
    case 'reflection':
      return <ReflectionModuleScreen module={module} page={page} nav={nav} />;
  }
}
