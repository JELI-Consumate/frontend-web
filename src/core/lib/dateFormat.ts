/**
 * Padanan pemakaian `package:intl` `DateFormat` di frontend-android, memakai
 * `Intl.DateTimeFormat` bawaan browser dengan locale `id-ID`.
 */

const longId = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** `DateFormat('d MMMM yyyy', 'id_ID')` -> "3 September 2026". */
export function formatLongDateId(date: Date): string {
  return longId.format(date);
}

/** `DateFormat('dd-MM-yyyy')` -> "03-09-2026". */
export function formatDashDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${date.getFullYear()}`;
}

/** Format tanggal untuk payload API: `yyyy-MM-dd` (setara `_formatDate` di AuthRepository). */
export function formatApiDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/** Parse tanggal dari JSON API; null kalau kosong / tak valid. */
export function parseApiDate(value: unknown): Date | null {
  if (typeof value !== 'string' || value.length === 0) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
