/** Pola & pesan validasi form auth — sama persis dengan frontend-android. */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const OTP_LENGTH = 6;

export const PASSWORD_MISMATCH_MESSAGE = 'Konfirmasi kata sandi belum cocok.';

export function validateEmail(raw: string): string | undefined {
  const email = raw.trim();
  if (email.length === 0) return 'Email wajib diisi.';
  if (!EMAIL_PATTERN.test(email)) return 'Format email belum benar.';
  return undefined;
}
