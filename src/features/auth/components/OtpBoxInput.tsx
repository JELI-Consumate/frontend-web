import { useRef, useState } from 'react';
import { cn } from '@/core/lib/cn';

interface OtpBoxInputProps {
  length: number;
  enabled: boolean;
  hasError: boolean;
  onChange: (code: string) => void;
  onCompleted: (code: string) => void;
}

/** Padanan `_OtpBoxInput` di `otp_verification_screen.dart`. */
export function OtpBoxInput({
  length,
  enabled,
  hasError,
  onChange,
  onCompleted,
}: OtpBoxInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array<string>(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  function focusBox(index: number) {
    inputsRef.current[Math.max(0, Math.min(index, length - 1))]?.focus();
  }

  function commit(next: string[]) {
    setDigits(next);
    const code = next.join('');
    onChange(code);
    if (code.length === length) {
      inputsRef.current.forEach((el) => el?.blur());
      onCompleted(code);
    }
  }

  function handleChange(index: number, rawValue: string) {
    const onlyDigits = rawValue.replace(/\D/g, '');

    if (onlyDigits.length > 1) {
      const next = [...digits];
      let cursor = index;
      for (const digit of onlyDigits.split('')) {
        if (cursor >= length) break;
        next[cursor] = digit;
        cursor += 1;
      }
      commit(next);
      focusBox(cursor);
      return;
    }

    const next = [...digits];
    next[index] = onlyDigits;
    commit(next);
    if (onlyDigits.length > 0 && index < length - 1) focusBox(index + 1);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && digits[index] === '' && index > 0) {
      focusBox(index - 1);
    }
  }

  return (
    <div className="flex gap-xs">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          disabled={!enabled}
          autoFocus={index === 0}
          value={digits[index] ?? ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={cn(
            'aspect-[0.8] w-full rounded-md border bg-background text-center',
            'text-[22px] font-extrabold text-ink outline-none transition-colors',
            'focus:border-[1.6px]',
            hasError ? 'border-danger focus:border-danger' : 'border-border focus:border-primary',
            !enabled && 'opacity-50',
          )}
        />
      ))}
    </div>
  );
}
