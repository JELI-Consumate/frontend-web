import { useId } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import { formatLongDateId } from '@/core/lib/dateFormat';

interface AppDateFieldProps {
  /** Nilai terpilih (tanpa waktu). */
  value: Date | null;
  onChange: (value: Date | null) => void;
  hintText: string;
  errorText?: string | null;
  disabled?: boolean;
  /** Batas atas tanggal yang bisa dipilih (default: hari ini). */
  max?: Date;
  min?: Date;
}

function toInputValue(date: Date | null): string {
  if (!date) return '';
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/**
 * Field tanggal dengan tampilan sama seperti `AppTextField` tapi memakai
 * date-picker native (padanan `showDatePicker` di Flutter). Menampilkan
 * `d MMMM yyyy` (locale id-ID).
 */
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
  const hasError = errorText != null;

  return (
    <div className="flex flex-col items-stretch">
      <div
        className={cn(
          'relative flex items-center gap-xs rounded-md border px-md',
          disabled ? 'bg-background' : 'bg-white',
          hasError ? 'border-danger' : 'border-border focus-within:border-[1.6px] focus-within:border-primary',
        )}
      >
        <CalendarDays size={20} className="shrink-0 text-muted" aria-hidden />
        <span
          className={cn(
            'flex-1 py-md text-body-md',
            value ? 'text-ink' : 'text-muted',
          )}
        >
          {value ? formatLongDateId(value) : hintText}
        </span>
        <input
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
          className="absolute inset-0 cursor-pointer opacity-0"
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
