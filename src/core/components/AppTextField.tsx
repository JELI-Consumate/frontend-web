import { useId, useState, type ComponentType } from 'react';
import { Eye, EyeOff, type LucideProps } from 'lucide-react';
import { cn } from '@/core/lib/cn';

interface AppTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  hintText: string;
  /** Ikon prefix (setara `icon` di Flutter). */
  icon: ComponentType<LucideProps>;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  errorText?: string | null;
  helperText?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  /** Ikon suffix statis (dipakai kalau bukan password). */
  suffixIcon?: ComponentType<LucideProps>;
  autoFocus?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  maxLength?: number;
  /** Setara `inputFormatters`: bersihkan nilai sebelum diteruskan ke `onChange`. */
  sanitize?: (raw: string) => string;
  onSubmit?: () => void;
  name?: string;
}

/** Setara `frontend-android/lib/core/widgets/app_text_field.dart`. */
export function AppTextField({
  value,
  onChange,
  hintText,
  icon: Icon,
  type = 'text',
  errorText,
  helperText,
  disabled = false,
  readOnly = false,
  onClick,
  suffixIcon: SuffixIcon,
  autoFocus = false,
  autoComplete,
  inputMode,
  maxLength,
  sanitize,
  onSubmit,
  name,
}: AppTextFieldProps) {
  const [hidden, setHidden] = useState(type === 'password');
  const hasError = errorText != null;
  const describedBy = useId();

  const effectiveType = type === 'password' ? (hidden ? 'password' : 'text') : type;

  return (
    <div className="flex flex-col items-stretch">
      <div
        className={cn(
          'flex items-center gap-xs rounded-md border px-md transition-colors duration-fast',
          'focus-within:border-[1.6px]',
          disabled ? 'bg-background' : 'bg-white',
          hasError
            ? 'border-danger focus-within:border-danger'
            : 'border-border focus-within:border-primary',
        )}
      >
        <Icon size={20} className="shrink-0 text-muted" aria-hidden />
        <input
          name={name}
          type={effectiveType}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={hintText}
          aria-invalid={hasError}
          aria-describedby={errorText || helperText ? describedBy : undefined}
          onClick={onClick}
          onChange={(e) => onChange(sanitize ? sanitize(e.target.value) : e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          className={cn(
            'peer w-full bg-transparent py-md text-body-md text-ink outline-none',
            'placeholder:text-muted disabled:cursor-not-allowed',
            (readOnly || onClick) && 'cursor-pointer',
          )}
        />
        {type === 'password' ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setHidden((h) => !h)}
            aria-label={hidden ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'}
            className="shrink-0 text-muted"
          >
            {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        ) : SuffixIcon ? (
          <SuffixIcon size={20} className="shrink-0 text-muted" aria-hidden />
        ) : null}
      </div>

      {hasError ? (
        <p id={describedBy} className="mt-xxs pl-xxs text-body-sm text-danger">
          {errorText}
        </p>
      ) : helperText ? (
        <p id={describedBy} className="mt-xxs pl-xxs text-body-sm text-ink-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
