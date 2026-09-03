import { isCompleted } from '@/core/model/learningStatus';
import { parseJourney, type Journey } from './journey';
import { parseLearningModule, type LearningModule } from './learningModule';

/** Padanan `frontend-android/lib/features/learning/data/models/journey_detail.dart`. */
export interface JourneyDetail {
  readonly journey: Journey;
  readonly modules: LearningModule[];
  readonly quizScore: number | null;
}

export function parseJourneyDetail(json: Record<string, unknown>): JourneyDetail {
  const rawModules = json['modules'];
  const quizScore = json['quiz_score'];
  return {
    journey: parseJourney(json),
    modules: Array.isArray(rawModules)
      ? (rawModules as Record<string, unknown>[]).map(parseLearningModule)
      : [],
    quizScore: typeof quizScore === 'number' ? Math.trunc(quizScore) : null,
  };
}

export function completedModuleCount(detail: JourneyDetail): number {
  return detail.modules.filter((m) => isCompleted(m.progress.status)).length;
}

export function currentModule(detail: JourneyDetail): LearningModule | null {
  return detail.modules.find((m) => !isCompleted(m.progress.status)) ?? null;
}
