import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAlert } from '@/core/components/alert/useAlert';
import { presentAuthError } from '../lib/authErrorMapper';
import { useLoginWithGoogleMutation } from '../api/authApi';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
export const googleAuthEnabled = GOOGLE_CLIENT_ID.length > 0;

/**
 * Padanan `GoogleAuthService.signInAndGetAccessToken` + `AuthScreen._handleGoogle`.
 * OAuth 2.0 implicit flow -> `access_token` -> POST `/auth/google`.
 */
export function useGoogleAuth() {
  const showAlert = useAlert();
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const [submitting, setSubmitting] = useState(false);

  const start = useGoogleLogin({
    flow: 'implicit',
    scope: 'email profile',
    onSuccess: async (response) => {
      try {
        await loginWithGoogle(response.access_token).unwrap();
        // sukses -> AuthController men-set user -> AppRoot pindah layar.
      } catch (error) {
        const presentation = presentAuthError(error, []);
        void showAlert({
          type: 'error',
          title: 'Gagal Masuk dengan Google',
          message: presentation.message ?? 'Terjadi kesalahan. Coba lagi.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    onError: () => {
      // batal / popup ditutup -> diam (sesuai Flutter yang mengembalikan null).
      setSubmitting(false);
    },
    onNonOAuthError: () => {
      setSubmitting(false);
    },
  });

  function handleGoogle(): void {
    if (!googleAuthEnabled) {
      void showAlert({
        type: 'info',
        title: 'Belum Tersedia',
        message: 'Masuk dengan Google belum dikonfigurasi di lingkungan ini.',
      });
      return;
    }
    setSubmitting(true);
    start();
  }

  return { handleGoogle, submitting };
}
