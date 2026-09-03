import { Fragment } from 'react';
import { cn } from '@/core/lib/cn';

interface HighlightTextProps {
  text: string;
  className?: string;
  /** Kelas untuk potongan **di antara bintang** (default `bodyHighlight`). */
  highlightClassName?: string;
  align?: 'left' | 'center' | 'right';
}

const MARKER = /\*\*(.+?)\*\*/g;

/**
 * Setara `frontend-android/lib/core/widgets/highlight_text.dart`: teks dengan
 * potongan `**...**` ditebalkan & diberi warna primary.
 */
export function HighlightText({
  text,
  className,
  highlightClassName = 'text-body-highlight text-primary',
  align = 'center',
}: HighlightTextProps) {
  const parts: Array<{ text: string; highlight: boolean }> = [];
  let cursor = 0;
  for (const match of text.matchAll(MARKER)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push({ text: text.slice(cursor, start), highlight: false });
    parts.push({ text: match[1] ?? '', highlight: true });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), highlight: false });

  return (
    <p
      className={cn(
        'text-body-lg text-ink',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}
      aria-label={text.replaceAll('**', '')}
    >
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part.highlight ? <span className={highlightClassName}>{part.text}</span> : part.text}
        </Fragment>
      ))}
    </p>
  );
}
