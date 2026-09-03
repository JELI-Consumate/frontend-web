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

/** Setara `_avatarIconFor` di `module_row.dart` / `_iconFor` di `module_header.dart`. */
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

/** Setara `_labelIconFor` (opening pakai info). */
export function moduleLabelIcon(type: ModuleContentType): ComponentType<LucideProps> {
  return type === 'opening' ? Info : moduleTypeIcon[type];
}
