import { isCompleted } from '@/core/model/learningStatus';
import type { Badge } from '@/features/badges/model/badge';
import { completedModuleCount, type JourneyDetail } from './journeyDetail';
import type { SectorDetail } from './sectorDetail';

/** Padanan `JourneyCelebrationData` di `journey_completion.dart`. */
export interface JourneyCelebrationData {
  journeyOrder: number;
  badge: Badge;
  modulesCompleted: number;
  modulesTotal: number;
  quizScore: number | null;
  nextJourneyId: string | null;
}

function fallbackBadge(journeyId: string, refreshed: JourneyDetail): Badge {
  return {
    id: '',
    journeyId,
    name: `${refreshed.journey.title} Selesai`,
    description: 'Kamu telah menuntaskan seluruh materi journey ini.',
    congratulationMessage: 'Selamat! Kamu telah menuntaskan seluruh materi journey ini.',
    motivationalMessage: null,
    iconUrl: null,
    earned: true,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Padanan `JourneyCompletionController.celebrationAfterModules` — murni data.
 * `null` kalau journey belum tuntas atau memang sudah lama selesai.
 */
export function computeJourneyCelebration(params: {
  journeyId: string;
  wasCompletedBefore: boolean;
  refreshed: JourneyDetail;
  badges: Badge[];
  sectorDetail: SectorDetail | null | undefined;
}): JourneyCelebrationData | null {
  const { journeyId, wasCompletedBefore, refreshed, badges, sectorDetail } = params;
  if (wasCompletedBefore) return null;
  if (!isCompleted(refreshed.journey.progress.status)) return null;

  const earnedBadge = badges.find((b) => b.journeyId === journeyId) ?? null;

  const nextJourney = (sectorDetail?.journeys ?? []).find(
    (j) => j.order === refreshed.journey.order + 1,
  );

  return {
    journeyOrder: refreshed.journey.order,
    badge: earnedBadge ?? fallbackBadge(journeyId, refreshed),
    modulesCompleted: completedModuleCount(refreshed),
    modulesTotal: refreshed.modules.length,
    quizScore: refreshed.quizScore,
    nextJourneyId: nextJourney?.id ?? null,
  };
}
