import { useAppSelector } from '@/app/hooks';

/** Setara `currentUserProvider`. */
export const useCurrentUser = () => useAppSelector((s) => s.auth.user);

/** Setara `isSignedInProvider`. */
export const useIsSignedIn = () => useAppSelector((s) => s.auth.user != null);

/** `true` setelah percobaan bootstrap sesi selesai (AuthController.build). */
export const useAuthBootstrapped = () => useAppSelector((s) => s.auth.bootstrapped);
