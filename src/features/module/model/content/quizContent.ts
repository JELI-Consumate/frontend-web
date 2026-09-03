/** Padanan `content/quiz_content.dart`. */
export type QuizSegmentType = 'multiple_choice' | 'likert' | 'unknown';

export function parseQuizSegmentType(value: unknown): QuizSegmentType {
  return value === 'multiple_choice' || value === 'likert' ? value : 'unknown';
}

function int(value: unknown): number {
  return typeof value === 'number' ? Math.trunc(value) : 0;
}

export interface QuizChoiceOption {
  readonly id: string;
  readonly optionText: string;
  readonly order: number;
}

export interface LikertScaleOption {
  readonly id: string;
  readonly value: number;
  readonly label: string;
  readonly order: number;
}

export interface QuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly order: number;
  readonly choiceOptions: QuizChoiceOption[];
}

export interface QuizSegment {
  readonly id: string;
  readonly segmentType: QuizSegmentType;
  readonly title: string;
  readonly instruction: string | null;
  readonly order: number;
  readonly questions: QuizQuestion[];
  readonly likertScaleOptions: LikertScaleOption[];
}

export interface QuizContent {
  readonly id: string;
  readonly passingScore: number;
  readonly shuffleQuestions: boolean;
  readonly segments: QuizSegment[];
}

function parseChoiceOption(json: Record<string, unknown>): QuizChoiceOption {
  return {
    id: json['id'] as string,
    optionText: json['option_text'] as string,
    order: int(json['order']),
  };
}

function parseLikertOption(json: Record<string, unknown>): LikertScaleOption {
  return {
    id: json['id'] as string,
    value: int(json['value']),
    label: json['label'] as string,
    order: int(json['order']),
  };
}

function parseQuestion(json: Record<string, unknown>): QuizQuestion {
  const raw = json['choice_options'];
  return {
    id: json['id'] as string,
    question: json['question'] as string,
    order: int(json['order']),
    choiceOptions: Array.isArray(raw)
      ? (raw as Record<string, unknown>[]).map(parseChoiceOption)
      : [],
  };
}

function parseSegment(json: Record<string, unknown>): QuizSegment {
  const rawQ = json['questions'];
  const rawL = json['likert_scale_options'];
  return {
    id: json['id'] as string,
    segmentType: parseQuizSegmentType(json['segment_type']),
    title: json['title'] as string,
    instruction: (json['instruction'] as string | undefined) ?? null,
    order: int(json['order']),
    questions: Array.isArray(rawQ) ? (rawQ as Record<string, unknown>[]).map(parseQuestion) : [],
    likertScaleOptions: Array.isArray(rawL)
      ? (rawL as Record<string, unknown>[]).map(parseLikertOption)
      : [],
  };
}

export function parseQuizContent(json: Record<string, unknown>): QuizContent {
  const raw = json['segments'];
  const passing = json['passing_score'];
  return {
    id: json['id'] as string,
    passingScore: typeof passing === 'number' ? Math.trunc(passing) : 70,
    shuffleQuestions: (json['shuffle_questions'] as boolean | undefined) ?? false,
    segments: Array.isArray(raw) ? (raw as Record<string, unknown>[]).map(parseSegment) : [],
  };
}
