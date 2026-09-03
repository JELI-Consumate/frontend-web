import {
  parseModuleContentType,
  type ModuleContentType,
} from '@/features/learning/model/learningModule';
import { parseModulePage, type ModulePage } from './modulePage';

/** Padanan `module_detail.dart`. */
export interface ModuleDetail {
  readonly id: string;
  readonly type: ModuleContentType;
  readonly title: string;
  readonly description: string | null;
  readonly estimatedMinutes: number;
  readonly pages: ModulePage[];
}

export function parseModuleDetail(json: Record<string, unknown>): ModuleDetail {
  const rawPages = json['pages'];
  const minutes = json['estimated_minutes'];
  return {
    id: json['id'] as string,
    type: parseModuleContentType(json['type']),
    title: json['title'] as string,
    description: (json['description'] as string | undefined) ?? null,
    estimatedMinutes: typeof minutes === 'number' ? Math.trunc(minutes) : 0,
    pages: Array.isArray(rawPages)
      ? (rawPages as Record<string, unknown>[]).map(parseModulePage)
      : [],
  };
}
