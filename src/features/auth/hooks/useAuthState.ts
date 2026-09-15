import { useAppSelector } from '@/app/hooks';

export const useCurrentUser = () => useAppSelector((s) => s.auth.user);

export const useIsSignedIn = () => useAppSelector((s) => s.auth.user != null);

export const useAuthBootstrapped = () => useAppSelector((s) => s.auth.bootstrapped);
