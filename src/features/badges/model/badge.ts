import { parseApiDate } from '@/core/lib/dateFormat';

/** Padanan `frontend-android/lib/features/badges/data/models/badge.dart`. */
export interface Badge {
  readonly id: string;
  readonly journeyId: string;
  readonly name: string;
  readonly description: string;
  readonly congratulationMessage: string | null;
  readonly motivationalMessage: string | null;
  readonly iconUrl: string | null;
  readonly earned: boolean;
  readonly earnedAt: string | null; // ISO
}

export function parseBadge(json: Record<string, unknown>): Badge {
  const earnedAt = parseApiDate(json['earned_at']);
  return {
    id: json['id'] as string,
    journeyId: json['journey_id'] as string,
    name: json['name'] as string,
    description: (json['description'] as string | undefined) ?? '',
    congratulationMessage: (json['congratulation_message'] as string | undefined) ?? null,
    motivationalMessage: (json['motivational_message'] as string | undefined) ?? null,
    iconUrl: (json['icon_url'] as string | undefined) ?? null,
    earned: (json['earned'] as boolean | undefined) ?? false,
    earnedAt: earnedAt ? earnedAt.toISOString() : null,
  };
}
