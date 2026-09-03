/** Padanan `quiz_attempt.dart`. */
function int(value: unknown): number | null {
  return typeof value === 'number' ? Math.trunc(value) : null;
}

export interface QuizReviewItem {
  readonly quizQuestionId: string;
  readonly question: string;
  readonly selectedOptionId: string;
  readonly correctOptionId: string | null;
  readonly isCorrect: boolean;
  readonly explanation: string | null;
}

export function parseQuizReviewItem(json: Record<string, unknown>): QuizReviewItem {
  return {
    quizQuestionId: json['quiz_question_id'] as string,
    question: json['question'] as string,
    selectedOptionId: json['selected_option_id'] as string,
    correctOptionId: (json['correct_option_id'] as string | undefined) ?? null,
    isCorrect: (json['is_correct'] as boolean | undefined) ?? false,
    explanation: (json['explanation'] as string | undefined) ?? null,
  };
}

export interface QuizAttempt {
  readonly attemptId: string;
  readonly quizContentId: string;
  readonly attemptNumber: number;
  readonly choiceScore: number | null;
  readonly choiceMaxScore: number | null;
  readonly percentage: number | null;
  readonly passed: boolean | null;
  readonly likertAverage: number | null;
  readonly review: QuizReviewItem[];
}

export function parseQuizAttempt(json: Record<string, unknown>): QuizAttempt {
  const rawReview = json['review'];
  const likert = json['likert_average'];
  return {
    attemptId: json['attempt_id'] as string,
    quizContentId: json['quiz_content_id'] as string,
    attemptNumber: int(json['attempt_number']) ?? 1,
    choiceScore: int(json['choice_score']),
    choiceMaxScore: int(json['choice_max_score']),
    percentage: int(json['percentage']),
    passed: (json['passed'] as boolean | undefined) ?? null,
    likertAverage: typeof likert === 'number' ? likert : null,
    review: Array.isArray(rawReview)
      ? (rawReview as Record<string, unknown>[]).map(parseQuizReviewItem)
      : [],
  };
}

export interface QuizAnswerCheckResult {
  readonly correct: boolean | null;
  readonly correctOptionId: string | null;
  readonly explanation: string | null;
  readonly attempt: QuizAttempt;
}

export function parseQuizAnswerCheckResult(
  json: Record<string, unknown>,
): QuizAnswerCheckResult {
  return {
    correct: (json['correct'] as boolean | undefined) ?? null,
    correctOptionId: (json['correct_option_id'] as string | undefined) ?? null,
    explanation: (json['explanation'] as string | undefined) ?? null,
    attempt: parseQuizAttempt(json['attempt'] as Record<string, unknown>),
  };
}
