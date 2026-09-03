/**
 * `AppTypography.*` sebagai kelas Tailwind. Tiap entri memuat ukuran + tinggi
 * baris + tracking + bobot (dari `text-*` di tailwind.config) PLUS warna default
 * (setara `TextStyle.color` di Flutter). Timpa warna dengan menambahkan kelas
 * `text-*` setelahnya — sama seperti `style.copyWith(color: ...)`.
 */
export const text = {
  displayLarge: 'text-display-lg text-primary',
  displayMedium: 'text-display-md text-primary',
  displaySmall: 'text-display-sm text-primary',
  titleLarge: 'text-title-lg text-black',
  titleMedium: 'text-title-md text-ink',
  titleSmall: 'text-title-sm text-ink',
  bodyLarge: 'text-body-lg text-ink',
  bodyMedium: 'text-body-md text-ink',
  bodySmall: 'text-body-sm text-ink-muted',
  bodyHighlight: 'text-body-highlight text-primary',
  labelLarge: 'text-label-lg text-white',
  labelMedium: 'text-label-md text-ink',
  labelSmall: 'text-label-sm text-ink-muted',
} as const;

export type TextVariant = keyof typeof text;
