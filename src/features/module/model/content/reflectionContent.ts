/** Padanan `content/reflection_content.dart`. */
export type ReflectionQuestionType = 'open_question' | 'checklist' | 'unknown';

export function parseReflectionQuestionType(value: unknown): ReflectionQuestionType {
  return value === 'open_question' || value === 'checklist' ? value : 'unknown';
}

function int(value: unknown): number {
  return typeof value === 'number' ? Math.trunc(value) : 0;
}

export interface ReflectionChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly order: number;
  readonly isChecked: boolean;
}

export interface ReflectionQuestion {
  readonly id: string;
  readonly questionType: ReflectionQuestionType;
  readonly questionText: string;
  readonly order: number;
  readonly answerText: string | null;
  readonly checklistItems: ReflectionChecklistItem[];
}

export interface ReflectionSection {
  readonly id: string;
  readonly title: string;
  readonly instruction: string | null;
  readonly order: number;
  readonly questions: ReflectionQuestion[];
}

export interface ReflectionContent {
  readonly id: string;
  readonly title: string;
  readonly openingMessage: string;
  readonly closingTitle: string | null;
  readonly closingMessage: string | null;
  readonly sections: ReflectionSection[];
}

function parseChecklistItem(json: Record<string, unknown>): ReflectionChecklistItem {
  return {
    id: json['id'] as string,
    label: json['label'] as string,
    order: int(json['order']),
    isChecked: (json['is_checked'] as boolean | undefined) ?? false,
  };
}

function parseQuestion(json: Record<string, unknown>): ReflectionQuestion {
  const raw = json['checklist_items'];
  return {
    id: json['id'] as string,
    questionType: parseReflectionQuestionType(json['question_type']),
    questionText: json['question_text'] as string,
    order: int(json['order']),
    answerText: (json['answer_text'] as string | undefined) ?? null,
    checklistItems: Array.isArray(raw)
      ? (raw as Record<string, unknown>[]).map(parseChecklistItem)
      : [],
  };
}

function parseSection(json: Record<string, unknown>): ReflectionSection {
  const raw = json['questions'];
  return {
    id: json['id'] as string,
    title: json['title'] as string,
    instruction: (json['instruction'] as string | undefined) ?? null,
    order: int(json['order']),
    questions: Array.isArray(raw) ? (raw as Record<string, unknown>[]).map(parseQuestion) : [],
  };
}

export function parseReflectionContent(json: Record<string, unknown>): ReflectionContent {
  const raw = json['sections'];
  return {
    id: json['id'] as string,
    title: json['title'] as string,
    openingMessage: (json['opening_message'] as string | undefined) ?? '',
    closingTitle: (json['closing_title'] as string | undefined) ?? null,
    closingMessage: (json['closing_message'] as string | undefined) ?? null,
    sections: Array.isArray(raw) ? (raw as Record<string, unknown>[]).map(parseSection) : [],
  };
}

/** Setara getter `openQuestions`. */
export function reflectionOpenQuestions(content: ReflectionContent): ReflectionQuestion[] {
  return content.sections
    .flatMap((s) => s.questions)
    .filter((q) => q.questionType === 'open_question');
}
