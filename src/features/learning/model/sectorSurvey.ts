import { parseApiDate } from '@/core/lib/dateFormat';

/** Padanan `frontend-android/lib/features/learning/data/models/sector_survey.dart`. */
export interface SectorSurvey {
  readonly link: string | null;
  readonly completedAt: string | null; // ISO
}

export const EMPTY_SECTOR_SURVEY: SectorSurvey = { link: null, completedAt: null };

export const surveyIsConfigured = (s: SectorSurvey): boolean =>
  s.link != null && s.link.length > 0;
export const surveyIsCompleted = (s: SectorSurvey): boolean => s.completedAt != null;

export function parseSectorSurvey(json: unknown): SectorSurvey {
  if (typeof json !== 'object' || json === null) return EMPTY_SECTOR_SURVEY;
  const obj = json as Record<string, unknown>;
  const completedAt = parseApiDate(obj['completed_at']);
  return {
    link: (obj['link'] as string | undefined) ?? null,
    completedAt: completedAt ? completedAt.toISOString() : null,
  };
}

export interface SectorSurveys {
  readonly pretest: SectorSurvey;
  readonly posttest: SectorSurvey;
}

export const EMPTY_SECTOR_SURVEYS: SectorSurveys = {
  pretest: EMPTY_SECTOR_SURVEY,
  posttest: EMPTY_SECTOR_SURVEY,
};

export function parseSectorSurveys(json: unknown): SectorSurveys {
  if (typeof json !== 'object' || json === null) return EMPTY_SECTOR_SURVEYS;
  const obj = json as Record<string, unknown>;
  return {
    pretest: parseSectorSurvey(obj['pretest']),
    posttest: parseSectorSurvey(obj['posttest']),
  };
}
