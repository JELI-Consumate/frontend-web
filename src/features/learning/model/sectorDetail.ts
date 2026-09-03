import { isCompleted, isInProgress, isNotStarted } from '@/core/model/learningStatus';
import { parseJourney, type Journey } from './journey';
import { parseSector, type Sector } from './sector';
import { surveyIsCompleted, surveyIsConfigured } from './sectorSurvey';

/** Padanan `frontend-android/lib/features/learning/data/models/sector_detail.dart`. */
export interface SectorDetail {
  readonly sector: Sector;
  readonly journeys: Journey[];
}

export function parseSectorDetail(json: Record<string, unknown>): SectorDetail {
  const rawJourneys = json['journeys'];
  return {
    sector: parseSector(json),
    journeys: Array.isArray(rawJourneys)
      ? (rawJourneys as Record<string, unknown>[]).map(parseJourney)
      : [],
  };
}

/* ---- getter turunan (setara getter di SectorDetail) ---- */

export function inProgressJourney(detail: SectorDetail): Journey | null {
  return detail.journeys.find((j) => isInProgress(j.progress.status)) ?? null;
}

export function pretestGateActive(detail: SectorDetail): boolean {
  const pretest = detail.sector.surveys.pretest;
  if (!surveyIsConfigured(pretest) || surveyIsCompleted(pretest)) return false;
  return detail.journeys.every((j) => isNotStarted(j.progress.status));
}

export function nextJourney(detail: SectorDetail): Journey | null {
  const unlockedIncomplete = detail.journeys.find(
    (j) => j.isUnlocked && !isCompleted(j.progress.status),
  );
  if (unlockedIncomplete) return unlockedIncomplete;
  return detail.journeys[0] ?? null;
}

export function allJourneysCompleted(detail: SectorDetail): boolean {
  return detail.journeys.every((j) => isCompleted(j.progress.status));
}
