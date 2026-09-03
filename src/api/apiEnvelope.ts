import { makeApiError } from './apiError';

/**
 * Semua endpoint backend membungkus payload di `{ "data": {...} }`.
 * Helper ini setara `requireData()` di frontend-android.
 */
export function requireData(body: unknown): Record<string, unknown> {
  const data = (body as { data?: unknown } | null)?.data;
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw makeApiError({ message: 'Respons server tidak dikenali.' });
  }
  return data as Record<string, unknown>;
}

/** Varian untuk endpoint yang `data`-nya berupa list (mis. `/sectors`, `/badges`). */
export function requireDataArray(body: unknown): Record<string, unknown>[] {
  const data = (body as { data?: unknown } | null)?.data;
  if (!Array.isArray(data)) {
    throw makeApiError({ message: 'Respons server tidak dikenali.' });
  }
  return data as Record<string, unknown>[];
}

/** Ambil `meta.message` kalau ada (dipakai endpoint auth berbasis pesan). */
export function metaMessage(body: unknown): string | null {
  const meta = (body as { meta?: unknown } | null)?.meta;
  if (typeof meta === 'object' && meta !== null) {
    const message = (meta as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return null;
}
