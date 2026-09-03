import { AxiosError } from 'axios';

/**
 * Padanan `frontend-android/lib/core/network/api_exception.dart`.
 * Bentuk error seragam untuk seluruh lapisan `api/`: pesan siap-tampil,
 * `statusCode`, `code` bisnis dari backend, dan `fieldErrors` untuk form.
 */
export interface ApiError {
  readonly name: 'ApiError';
  readonly message: string;
  readonly statusCode?: number;
  readonly code?: string;
  readonly fieldErrors: Record<string, string[]>;
}

export function makeApiError(init: {
  message: string;
  statusCode?: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}): ApiError {
  return {
    name: 'ApiError',
    message: init.message,
    statusCode: init.statusCode,
    code: init.code,
    fieldErrors: init.fieldErrors ?? {},
  };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { name?: unknown }).name === 'ApiError' &&
    typeof (value as { message?: unknown }).message === 'string'
  );
}

/* ---- predikat setara getter di ApiException ---- */
export const isUnauthorized = (e: ApiError) => e.statusCode === 401;
export const isValidation = (e: ApiError) => e.statusCode === 422;
export const isThrottled = (e: ApiError) => e.statusCode === 429;
export const isGoogleOnlyAccount = (e: ApiError) => e.code === 'GOOGLE_ONLY_ACCOUNT';
export const isInvalidCredentials = (e: ApiError) => e.code === 'INVALID_CREDENTIALS';
export const isEmailNotVerified = (e: ApiError) => e.code === 'EMAIL_NOT_VERIFIED';
export const isInvalidResetOtp = (e: ApiError) => e.code === 'INVALID_RESET_OTP';
export const isInvalidOtp = (e: ApiError) => e.code === 'INVALID_OTP';

export function firstFieldError(e: ApiError, field: string): string | undefined {
  return e.fieldErrors[field]?.[0];
}

function networkMessage(code?: string): string {
  switch (code) {
    case AxiosError.ECONNABORTED:
    case AxiosError.ETIMEDOUT:
      return 'Koneksi timeout. Periksa jaringanmu lalu coba lagi.';
    case AxiosError.ERR_NETWORK:
      return 'Tidak bisa terhubung ke server. Periksa koneksi internetmu.';
    case AxiosError.ERR_CANCELED:
      return 'Permintaan dibatalkan.';
    default:
      return 'Terjadi kesalahan tak terduga. Coba lagi sebentar.';
  }
}

function statusMessage(status?: number): string {
  if (status === undefined) return 'Terjadi kesalahan. Coba lagi sebentar.';
  if (status === 401) return 'Sesi kamu sudah berakhir. Silakan masuk lagi.';
  if (status === 403) return 'Kamu tidak punya akses ke sumber daya ini.';
  if (status === 404) return 'Data yang diminta tidak ditemukan.';
  if (status === 429) return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
  if (status >= 500) return 'Server sedang bermasalah. Coba lagi nanti.';
  return 'Terjadi kesalahan. Coba lagi sebentar.';
}

interface ApiErrorBody {
  message?: unknown;
  code?: unknown;
  errors?: unknown;
}

/** Petakan `AxiosError` -> `ApiError` (setara `ApiException.fromDio`). */
export function apiErrorFromAxios(error: AxiosError): ApiError {
  const response = error.response;

  if (!response) {
    return makeApiError({ message: networkMessage(error.code) });
  }

  const raw: unknown = response.data;
  if (typeof raw !== 'object' || raw === null) {
    return makeApiError({
      message: statusMessage(response.status),
      statusCode: response.status,
    });
  }
  const body = raw as ApiErrorBody;

  const fieldErrors: Record<string, string[]> = {};
  const rawErrors = body.errors;
  if (typeof rawErrors === 'object' && rawErrors !== null) {
    for (const [key, value] of Object.entries(rawErrors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map((v) => String(v));
      } else if (value != null) {
        fieldErrors[key] = [String(value)];
      }
    }
  }

  const message =
    typeof body.message === 'string' && body.message.length > 0
      ? body.message
      : statusMessage(response.status);

  return makeApiError({
    message,
    statusCode: response.status,
    code: typeof body.code === 'string' ? body.code : undefined,
    fieldErrors,
  });
}

/** Normalisasi apa pun yang tertangkap menjadi `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (error instanceof AxiosError) return apiErrorFromAxios(error);
  if (error instanceof Error) return makeApiError({ message: error.message });
  return makeApiError({ message: 'Terjadi kesalahan tak terduga. Coba lagi sebentar.' });
}
