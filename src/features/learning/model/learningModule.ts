import {
  parseLearningProgress,
  type LearningProgress,
} from '@/core/model/learningStatus';

/** Padanan `frontend-android/lib/features/learning/data/models/learning_module.dart`. */
export type ModuleContentType =
  | 'opening'
  | 'video'
  | 'materi'
  | 'infografis'
  | 'komik'
  | 'kuis'
  | 'simulasi'
  | 'refleksi'
  | 'unknown';

const MODULE_CONTENT_TYPES: ModuleContentType[] = [
  'opening',
  'video',
  'materi',
  'infografis',
  'komik',
  'kuis',
  'simulasi',
  'refleksi',
];

export function parseModuleContentType(value: unknown): ModuleContentType {
  return MODULE_CONTENT_TYPES.find((t) => t === value) ?? 'unknown';
}

export interface LearningModule {
  readonly id: string;
  readonly type: ModuleContentType;
  readonly title: string;
  readonly description: string | null;
  readonly order: number;
  readonly estimatedMinutes: number;
  readonly isRequired: boolean;
  readonly progress: LearningProgress;
  readonly pageIds: string[];
  readonly locked: boolean;
}

function int(value: unknown): number {
  return typeof value === 'number' ? Math.trunc(value) : 0;
}

export function parseLearningModule(json: Record<string, unknown>): LearningModule {
  const rawPages = json['pages'];
  return {
    id: json['id'] as string,
    type: parseModuleContentType(json['type']),
    title: json['title'] as string,
    description: (json['description'] as string | undefined) ?? null,
    order: int(json['order']),
    estimatedMinutes: int(json['estimated_minutes']),
    isRequired: (json['is_required'] as boolean | undefined) ?? true,
    progress: parseLearningProgress(json['progress']),
    locked: (json['locked'] as boolean | undefined) ?? false,
    pageIds: Array.isArray(rawPages)
      ? (rawPages as Record<string, unknown>[]).map((p) => p['id'] as string)
      : [],
  };
}

export const MODULE_TYPE_SHORT_LABEL: Record<ModuleContentType, string> = {
  opening: 'Opening',
  video: 'Video',
  materi: 'Materi',
  infografis: 'Infografis',
  komik: 'Komik',
  kuis: 'Kuis',
  simulasi: 'Simulasi',
  refleksi: 'Refleksi',
  unknown: 'Materi',
};
