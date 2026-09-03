/**
 * Nilai token mentah dari `frontend-android/lib/core/theme/*`, untuk tempat yang
 * butuh angka/warna sebagai nilai JS (mis. hitung `LinearProgressIndicator`,
 * warna sektor dinamis dari DB). Untuk styling biasa pakai kelas Tailwind.
 */
export const colors = {
  primary: '#0037B0',
  primaryPressed: '#002B8C',
  ink: '#434655',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#C4C5D7',
  background: '#F8F9FF',
  danger: '#D1344B',
  success: '#1E9E5A',
  warning: '#E9A23B',
} as const;

/** `AppColors.*` yang beralpha (dipakai kalau perlu string rgba eksplisit). */
export const alphaColors = {
  primarySoft: 'rgba(0, 55, 176, 0.08)',
  dangerSoft: 'rgba(209, 52, 75, 0.12)',
  successSoft: 'rgba(30, 158, 90, 0.12)',
  warningSoft: 'rgba(233, 162, 59, 0.12)',
  inkMuted: 'rgba(67, 70, 85, 0.75)',
  border: 'rgba(196, 197, 215, 0.5)',
} as const;

/** `AppSpacing` dalam px (angka). */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
  xxxxl: 64,
  screenPadding: 24,
} as const;

/** `AppRadius` dalam px. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/** `AppDuration` dalam ms. */
export const duration = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
