import { parseApiDate } from '@/core/lib/dateFormat';

/** Padanan `frontend-android/lib/features/auth/data/models/app_user.dart`. */
export interface AppUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly dateOfBirth: string | null; // ISO; disimpan sebagai string agar aman di Redux
  readonly avatarUrl: string | null;
  readonly emailVerifiedAt: string | null;
}

export function isEmailVerified(user: AppUser): boolean {
  return user.emailVerifiedAt != null;
}

export function parseAppUser(json: Record<string, unknown>): AppUser {
  const dob = parseApiDate(json['date_of_birth']);
  const verified = parseApiDate(json['email_verified_at']);
  return {
    id: (json['id'] as string | undefined) ?? '',
    name: (json['name'] as string | undefined) ?? '',
    email: (json['email'] as string | undefined) ?? '',
    phone: (json['phone'] as string | undefined) ?? null,
    dateOfBirth: dob ? dob.toISOString() : null,
    avatarUrl: (json['avatar_url'] as string | undefined) ?? null,
    emailVerifiedAt: verified ? verified.toISOString() : null,
  };
}
