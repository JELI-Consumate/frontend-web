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
  Clock,
  type LucideProps,
} from 'lucide-react';
import {
  MODULE_TYPE_SHORT_LABEL,
  type ModuleContentType,
} from '@/features/learning/model/learningModule';
import type { ModuleDetail } from '../model/moduleDetail';

const TYPE_ICON: Record<ModuleContentType, ComponentType<LucideProps>> = {
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

/** Padanan `module_header.dart`. */
export function ModuleHeader({ module }: { module: ModuleDetail }) {
  const Icon = TYPE_ICON[module.type];
  return (
    <div className="flex flex-col items-stretch">
      <div className="flex items-center">
        <span className="inline-flex items-center gap-[3px] rounded-pill bg-primary-soft px-sm py-[3px] text-label-md font-bold text-primary">
          <Icon size={13} />
          {MODULE_TYPE_SHORT_LABEL[module.type]}
        </span>
        <span className="flex-1" />
        <Clock size={14} className="text-ink-muted" />
        <span className="ml-xxs text-body-sm text-ink-muted">{module.estimatedMinutes} menit</span>
      </div>
      <h1 className="mt-sm text-display-sm text-primary">{module.title}</h1>
      {module.description ? (
        <p className="mt-xs text-body-md text-ink">{module.description}</p>
      ) : null}
    </div>
  );
}
