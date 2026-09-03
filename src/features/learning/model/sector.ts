import {
  parseLearningProgress,
  ZERO_PROGRESS,
  type LearningProgress,
} from '@/core/model/learningStatus';
import {
  EMPTY_SECTOR_SURVEYS,
  parseSectorSurveys,
  type SectorSurveys,
} from './sectorSurvey';

/** Padanan `frontend-android/lib/features/learning/data/models/sector.dart`. */
export interface Sector {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string | null;
  readonly iconUrl: string | null;
  readonly color: string | null;
  readonly order: number;
  readonly progress: LearningProgress;
  readonly surveys: SectorSurveys;
}

export function parseSector(json: Record<string, unknown>): Sector {
  const order = json['order'];
  return {
    id: json['id'] as string,
    slug: json['slug'] as string,
    name: json['name'] as string,
    description: (json['description'] as string | undefined) ?? null,
    iconUrl: (json['icon_url'] as string | undefined) ?? null,
    color: (json['color'] as string | undefined) ?? null,
    order: typeof order === 'number' ? Math.trunc(order) : 0,
    progress: json['progress'] ? parseLearningProgress(json['progress']) : ZERO_PROGRESS,
    surveys: json['surveys'] ? parseSectorSurveys(json['surveys']) : EMPTY_SECTOR_SURVEYS,
  };
}
