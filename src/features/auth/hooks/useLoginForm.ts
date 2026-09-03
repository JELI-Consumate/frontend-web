import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isApiError, isEmailNotVerified } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { useLoginMutation } from '../api/authApi';
import { presentAuthError } from '../lib/authErrorMapper';
import { EMAIL_PATTERN } from '../lib/validators';

const KNOWN_FIELDS = ['email', 'password'] as const;

/** Padanan `_LoginFormState` di `login_form.dart`. */
export function useLoginForm() {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    const trimmed = email.trim();
    if (trimmed.length === 0) next.email = 'Email wajib diisi.';
    else if (!EMAIL_PATTERN.test(trimmed)) next.email = 'Format email belum benar.';
    if (password.length === 0) next.password = 'Kata sandi wajib diisi.';
    return next;
  }

  async function submit(): Promise<void> {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const trimmed = email.trim();
    try {
      await login({ email: trimmed, password }).unwrap();
      // sukses -> AuthController men-set user -> AppRoot pindah layar.
    } catch (error) {
      if (isApiError(error) && isEmailNotVerified(error)) {
        navigate('/auth/otp', { state: { email: trimmed } });
        return;
      }
      const presentation = presentAuthError(error, KNOWN_FIELDS);
      setErrors(presentation.fieldErrors);
      if (presentation.message) {
        void showAlert({
          type: 'error',
          title: 'Gagal Masuk',
          message: presentation.message,
        });
      }
    }
  }

  return {
    email,
    password,
    errors,
    submitting: isLoading,
    setEmail: (v: string) => setEmail(v),
    setPassword: (v: string) => setPassword(v),
    submit,
  };
}
