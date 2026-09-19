import { useId, useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import { formatLongDateId } from '@/core/lib/dateFormat';

interface AppDateFieldProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  hintText: string;
  errorText?: string | null;
  disabled?: boolean;
  max?: Date;
  min?: Date;
}

function toInputValue(date: Date | null): string {
  if (!date) return '';
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export function AppDateField({
  value,
  onChange,
  hintText,
  errorText,
  disabled = false,
  max = new Date(),
  min,
}: AppDateFieldProps) {
  const describedBy = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = errorText != null;

  return (
    <div className="flex flex-col items-stretch">
      <div
        onClick={
          disabled
            ? undefined
            : () => {
                try {
                  inputRef.current?.showPicker?.();
                } catch {
                  inputRef.current?.focus();
                }
              }
        }
        className={cn(
          'relative flex items-center gap-xs rounded-md border px-md',
          disabled ? 'bg-background' : 'bg-white cursor-pointer',
          hasError
            ? 'border-danger'
            : 'border-border focus-within:border-[1.6px] focus-within:border-primary',
        )}
      >
        <CalendarDays size={20} className="shrink-0 text-muted" aria-hidden />
        <span className={cn('flex-1 py-md text-body-md', value ? 'text-ink' : 'text-muted')}>
          {value ? formatLongDateId(value) : hintText}
        </span>
        <input
          ref={inputRef}
          type="date"
          disabled={disabled}
          value={toInputValue(value)}
          max={toInputValue(max)}
          min={min ? toInputValue(min) : undefined}
          aria-label={hintText}
          aria-invalid={hasError}
          aria-describedby={errorText ? describedBy : undefined}
          onChange={(e) => {
            const raw = e.target.value;
            if (!raw) {
              onChange(null);
              return;
            }
            const [y, m, d] = raw.split('-').map(Number);
            onChange(new Date(y!, (m ?? 1) - 1, d ?? 1));
          }}
          className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
          tabIndex={-1}
        />
      </div>
      {hasError ? (
        <p id={describedBy} className="mt-xxs pl-xxs text-body-sm text-danger">
          {errorText}
        </p>
      ) : null}
    </div>
  );
}
