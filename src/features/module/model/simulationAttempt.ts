/** Padanan `simulation_attempt.dart`. */
function int(value: unknown): number | null {
  return typeof value === 'number' ? Math.trunc(value) : null;
}

export interface MatchingReviewItem {
  readonly pairId: string;
  readonly isCorrect: boolean;
}

export interface OrderingReviewItem {
  readonly stepId: string;
  readonly submittedPosition: number;
  readonly isCorrect: boolean;
}

export interface SimulationAttempt {
  readonly attemptId: string;
  readonly simulationContentId: string;
  readonly score: number | null;
  readonly maxScore: number | null;
  readonly isPassed: boolean | null;
  readonly isCompleted: boolean;
  readonly matchingReview: MatchingReviewItem[];
  readonly orderingReview: OrderingReviewItem[];
}

export function parseSimulationAttempt(json: Record<string, unknown>): SimulationAttempt {
  const rawM = json['matching_review'];
  const rawO = json['ordering_review'];
  return {
    attemptId: json['attempt_id'] as string,
    simulationContentId: json['simulation_content_id'] as string,
    score: int(json['score']),
    maxScore: int(json['max_score']),
    isPassed: (json['is_passed'] as boolean | undefined) ?? null,
    isCompleted: json['completed_at'] != null,
    matchingReview: Array.isArray(rawM)
      ? (rawM as Record<string, unknown>[]).map((j) => ({
          pairId: j['simulation_matching_pair_id'] as string,
          isCorrect: (j['is_correct'] as boolean | undefined) ?? false,
        }))
      : [],
    orderingReview: Array.isArray(rawO)
      ? (rawO as Record<string, unknown>[]).map((j) => ({
          stepId: j['simulation_ordering_step_id'] as string,
          submittedPosition: int(j['submitted_position']) ?? 0,
          isCorrect: (j['is_correct'] as boolean | undefined) ?? false,
        }))
      : [],
  };
}

export interface SimulationCheckResult {
  readonly correct: boolean;
  readonly attempt: SimulationAttempt;
}

export function parseSimulationCheckResult(
  json: Record<string, unknown>,
): SimulationCheckResult {
  return {
    correct: (json['correct'] as boolean | undefined) ?? false,
    attempt: parseSimulationAttempt(json['attempt'] as Record<string, unknown>),
  };
}
