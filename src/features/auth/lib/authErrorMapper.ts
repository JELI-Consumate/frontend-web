import { isApiError } from '@/api/apiError';

/** Padanan `presentAuthError` di `auth_error_mapper.dart`. */
export interface AuthErrorPresentation {
  fieldErrors: Record<string, string>;
  message: string | null;
}

export function presentAuthError(
  error: unknown,
  knownFields: readonly string[],
): AuthErrorPresentation {
  if (!isApiError(error)) {
    return { fieldErrors: {}, message: 'Terjadi kesalahan tak terduga. Coba lagi sebentar.' };
  }

  const known = new Set(knownFields);
  const inline: Record<string, string> = {};
  const leftovers: string[] = [];

  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    if (messages.length === 0) continue;
    const first = messages[0]!;
    if (known.has(field)) {
      inline[field] = first;
    } else {
      leftovers.push(...messages);
    }
  }

  if (Object.keys(inline).length === 0) {
    return {
      fieldErrors: {},
      message: leftovers.length === 0 ? error.message : leftovers.join('\n'),
    };
  }

  return {
    fieldErrors: inline,
    message: leftovers.length === 0 ? null : leftovers.join('\n'),
  };
}
