import { Lock, Check, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import { isCompleted as statusCompleted } from '@/core/model/learningStatus';
import {
  MODULE_TYPE_SHORT_LABEL,
  type LearningModule,
} from '../model/learningModule';
import { moduleLabelIcon, moduleTypeIcon } from '../lib/moduleTypeIcon';

interface ModuleRowProps {
  module: LearningModule;
  isCurrent: boolean;
  onTap: () => void;
}

/** Padanan `module_row.dart`. */
export function ModuleRow({ module, isCurrent, onTap }: ModuleRowProps) {
  const isCompleted = statusCompleted(module.progress.status);
  const isLocked = module.locked;
  const TypeIcon = moduleTypeIcon[module.type];
  const LabelIcon = moduleLabelIcon(module.type);

  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onTap}
      disabled={isLocked}
      className={cn(
        'flex w-full items-center gap-md rounded-md border bg-white p-sm text-left',
        isCurrent ? 'border-[1.4px] border-primary' : 'border-border',
        isLocked && 'opacity-50',
      )}
    >
      <span
        className={cn(
          'flex h-36 w-36 shrink-0 items-center justify-center rounded-full',
          isLocked
            ? 'bg-background text-ink-muted'
            : isCurrent
              ? 'bg-primary text-white'
              : isCompleted
                ? 'bg-success text-white'
                : 'bg-primary-soft text-primary',
        )}
      >
        {isLocked ? <Lock size={18} /> : isCompleted ? <Check size={20} /> : <TypeIcon size={18} />}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'line-clamp-2 block text-body-lg text-ink',
            isCurrent ? 'font-bold' : 'font-semibold',
          )}
        >
          {module.order}. {module.title}
        </span>
        <span className="mt-[2px] flex items-center gap-[3px] text-body-sm text-ink-muted">
          {isLocked ? (
            <>
              <Lock size={13} />
              <span className="truncate">Selesaikan modul sebelumnya</span>
            </>
          ) : (
            <>
              <LabelIcon size={13} />
              <span className="truncate">{MODULE_TYPE_SHORT_LABEL[module.type]}</span>
              <span>•</span>
              {isCompleted ? (
                <>
                  <CheckCircle2 size={13} className="text-success" />
                  <span className="font-semibold text-success">Selesai</span>
                </>
              ) : (
                <span className="truncate">{module.estimatedMinutes} menit</span>
              )}
            </>
          )}
        </span>
      </span>

      <ChevronRight className="shrink-0 text-muted" />
    </button>
  );
}
