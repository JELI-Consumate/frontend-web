import { cn } from '@/core/lib/cn';

interface SegmentedTabsProps {
  labels: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

/** Setara `frontend-android/lib/core/widgets/segmented_tabs.dart`. */
export function SegmentedTabs({ labels, activeIndex, onChange }: SegmentedTabsProps) {
  return (
    <div className="flex" role="tablist">
      {labels.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(index)}
            className={cn(
              'flex-1 py-sm text-center transition-all duration-fast',
              'border-b',
              isActive
                ? 'border-b-[2.5px] border-primary text-title-md text-primary'
                : 'border-border text-body-md text-ink-muted',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
