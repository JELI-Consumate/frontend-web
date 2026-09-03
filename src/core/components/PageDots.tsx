import { cn } from '@/core/lib/cn';

interface PageDotsProps {
  count: number;
  activeIndex: number;
  onDotTap?: (index: number) => void;
}

/** Setara `frontend-android/lib/core/widgets/page_dots.dart`. */
export function PageDots({ count, activeIndex, onDotTap }: PageDotsProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        const dot = (
          <span
            className={cn(
              'mx-xxs h-xs rounded-pill transition-all duration-normal ease-out',
              isActive ? 'w-xs bg-primary' : 'w-xs bg-muted',
            )}
          />
        );

        if (!onDotTap) return <span key={index}>{dot}</span>;

        return (
          <button
            key={index}
            type="button"
            aria-label={`Halaman ${index + 1} dari ${count}`}
            aria-current={isActive}
            onClick={() => onDotTap(index)}
            className="flex items-center py-xs"
          >
            {dot}
          </button>
        );
      })}
    </div>
  );
}
