import {
  parseLearningProgress,
  type LearningProgress,
} from '@/core/model/learningStatus';

/** Padanan `frontend-android/lib/features/learning/data/models/journey.dart`. */
export interface Journey {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
  readonly order: number;
  readonly estimatedMinutes: number;
  readonly isUnlocked: boolean;
  readonly modulesCount: number;
  readonly progress: LearningProgress;
}

function int(value: unknown): number {
  return typeof value === 'number' ? Math.trunc(value) : 0;
}

export function parseJourney(json: Record<string, unknown>): Journey {
  return {
    id: json['id'] as string,
    slug: json['slug'] as string,
    title: json['title'] as string,
    description: (json['description'] as string | undefined) ?? null,
    imageUrl: (json['image_url'] as string | undefined) ?? null,
    order: int(json['order']),
    estimatedMinutes: int(json['estimated_minutes']),
    isUnlocked: (json['is_unlocked'] as boolean | undefined) ?? false,
    modulesCount: int(json['modules_count']),
    progress: parseLearningProgress(json['progress']),
  };
}
