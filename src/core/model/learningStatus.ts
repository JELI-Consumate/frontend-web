/**
 * Padanan `frontend-android/lib/core/models/learning_status.dart`.
 * Kosakata progres bersama seluruh domain belajar (sector, journey, module,
 * module page). Di `core/` karena dipakai lintas fitur `learning` & `module`.
 */
export type LearningStatus = 'not_started' | 'in_progress' | 'completed';

export const LearningStatus = {
  notStarted: 'not_started',
  inProgress: 'in_progress',
  completed: 'completed',
} as const satisfies Record<string, LearningStatus>;

export function parseLearningStatus(value: unknown): LearningStatus {
  return value === 'in_progress' || value === 'completed' ? value : 'not_started';
}

export const isCompleted = (s: LearningStatus): boolean => s === 'completed';
export const isInProgress = (s: LearningStatus): boolean => s === 'in_progress';
export const isNotStarted = (s: LearningStatus): boolean => s === 'not_started';

export interface LearningProgress {
  readonly status: LearningStatus;
  readonly percent: number;
}

export const ZERO_PROGRESS: LearningProgress = { status: 'not_started', percent: 0 };

export function parseLearningProgress(json: unknown): LearningProgress {
  if (typeof json !== 'object' || json === null) return ZERO_PROGRESS;
  const obj = json as Record<string, unknown>;
  const percent = obj['percent'];
  return {
    status: parseLearningStatus(obj['status']),
    percent: typeof percent === 'number' ? Math.trunc(percent) : 0,
  };
}
