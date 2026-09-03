import { useState } from 'react';
import { useAlert } from '@/core/components/alert/useAlert';
import { useForgotPasswordMutation } from '../api/authApi';
import { presentAuthError } from '../lib/authErrorMapper';
import { EMAIL_PATTERN } from '../lib/validators';

/** Padanan `_ForgotPasswordScreenState`. */
export function useForgotPasswordForm() {
  const showAlert = useAlert();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  async function submit(): Promise<void> {
    const trimmed = email.trim();
    if (trimmed.length === 0) {
      setEmailError('Email wajib diisi.');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError('Format email belum benar.');
      return;
    }
    setEmailError(null);

    try {
      const message = await forgotPassword(trimmed).unwrap();
      setConfirmationMessage(message);
    } catch (error) {
      const presentation = presentAuthError(error, ['email']);
      setEmailError(presentation.fieldErrors.email ?? null);
      if (presentation.message) {
        void showAlert({ type: 'error', title: 'Gagal Mengirim', message: presentation.message });
      }
    }
  }

  return {
    email,
    emailError,
    confirmationMessage,
    submitting: isLoading,
    setEmail: (v: string) => setEmail(v),
    submit,
  };
}
