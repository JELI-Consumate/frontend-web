import type { ComponentType } from 'react';
import {
  Circle,
  PlayCircle,
  FileText,
  BarChart3,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Pencil,
  Info,
  type LucideProps,
} from 'lucide-react';
import type { ModuleContentType } from '../model/learningModule';

export const moduleTypeIcon: Record<ModuleContentType, ComponentType<LucideProps>> = {
  opening: Circle,
  video: PlayCircle,
  materi: FileText,
  infografis: BarChart3,
  komik: BookOpen,
  kuis: HelpCircle,
  simulasi: Gamepad2,
  refleksi: Pencil,
  unknown: Circle,
};

export function moduleLabelIcon(type: ModuleContentType): ComponentType<LucideProps> {
  return type === 'opening' ? Info : moduleTypeIcon[type];
}
