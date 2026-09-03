import {
  parseLearningStatus,
  type LearningStatus,
} from '@/core/model/learningStatus';
import { makeApiError } from '@/api/apiError';
import { parseArticleContent, type ArticleContent } from './content/articleContent';
import { parseVideoContent, type VideoContent } from './content/videoContent';
import { parseQuizContent, type QuizContent } from './content/quizContent';
import {
  parseReflectionContent,
  type ReflectionContent,
} from './content/reflectionContent';
import {
  parseSimulationContent,
  type SimulationContent,
} from './content/simulationContent';

/** Padanan `content_type` enum. */
export type ContentType = 'video' | 'article' | 'quiz' | 'simulation' | 'reflection' | 'unknown';

export function parseContentType(value: unknown): ContentType {
  switch (value) {
    case 'video':
    case 'article':
    case 'quiz':
    case 'simulation':
    case 'reflection':
      return value;
    default:
      return 'unknown';
  }
}

/** Padanan `sealed class ModulePageContent` → union bertag. */
export type ModulePageContent =
  | { readonly kind: 'video'; readonly content: VideoContent }
  | { readonly kind: 'article'; readonly content: ArticleContent }
  | { readonly kind: 'quiz'; readonly content: QuizContent }
  | { readonly kind: 'simulation'; readonly content: SimulationContent }
  | { readonly kind: 'reflection'; readonly content: ReflectionContent };

function parseModulePageContent(
  type: ContentType,
  json: Record<string, unknown>,
): ModulePageContent {
  switch (type) {
    case 'video':
      return { kind: 'video', content: parseVideoContent(json) };
    case 'article':
      return { kind: 'article', content: parseArticleContent(json) };
    case 'quiz':
      return { kind: 'quiz', content: parseQuizContent(json) };
    case 'simulation':
      return { kind: 'simulation', content: parseSimulationContent(json) };
    case 'reflection':
      return { kind: 'reflection', content: parseReflectionContent(json) };
    case 'unknown':
      throw makeApiError({ message: 'Tipe konten module_page tidak dikenali.' });
  }
}

export interface ModulePage {
  readonly id: string;
  readonly order: number;
  readonly contentType: ContentType;
  readonly content: ModulePageContent;
  readonly status: LearningStatus;
  readonly lastPosition: number;
}

export function parseModulePage(json: Record<string, unknown>): ModulePage {
  const contentType = parseContentType(json['content_type']);
  const rawContent = (json['content'] as Record<string, unknown> | undefined) ?? {};
  const rawProgress = json['progress'] as Record<string, unknown> | undefined;
  const order = json['order'];
  const lastPos = rawProgress?.['last_position'];

  return {
    id: json['id'] as string,
    order: typeof order === 'number' ? Math.trunc(order) : 0,
    contentType,
    content: parseModulePageContent(contentType, rawContent),
    status: parseLearningStatus(rawProgress?.['status']),
    lastPosition: typeof lastPos === 'number' ? Math.trunc(lastPos) : 0,
  };
}
