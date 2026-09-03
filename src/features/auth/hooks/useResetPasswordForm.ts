import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/core/components/alert/useAlert';
import { useResetPasswordMutation } from '../api/authApi';
import { presentAuthError } from '../lib/authErrorMapper';
import { EMAIL_PATTERN, OTP_LENGTH } from '../lib/validators';

const KNOWN_FIELDS = ['email', 'otp', 'password', 'password_confirmation'] as const;

/** Padanan `_ResetPasswordScreenState`. */
export function useResetPasswordForm(initialEmail?: string) {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [email, setEmail] = useState(initialEmail ?? '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) next.email = 'Email wajib diisi.';
    else if (!EMAIL_PATTERN.test(trimmedEmail)) next.email = 'Format email belum benar.';

    const trimmedOtp = otp.trim();
    if (trimmedOtp.length === 0) next.otp = 'Kode reset wajib diisi.';
    else if (trimmedOtp.length !== OTP_LENGTH) next.otp = `Kode reset harus ${OTP_LENGTH} digit.`;

    if (password.length === 0) next.password = 'Kata sandi baru wajib diisi.';
    else if (password.length < 8) next.password = 'Kata sandi minimal 8 karakter.';

    if (passwordConfirmation !== password)
      next.password_confirmation = 'Konfirmasi kata sandi belum cocok.';

    return next;
  }

  async function submit(): Promise<void> {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      const message = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
        passwordConfirmation,
      }).unwrap();
      navigate('/auth');
      void showAlert({ type: 'success', title: 'Berhasil', message });
    } catch (error) {
      const presentation = presentAuthError(error, KNOWN_FIELDS);
      setErrors(presentation.fieldErrors);
      if (presentation.message) {
        void showAlert({
          type: 'error',
          title: 'Gagal Reset Kata Sandi',
          message: presentation.message,
        });
      }
    }
  }

  return {
    values: { email, otp, password, passwordConfirmation },
    errors,
    submitting: isLoading,
    setEmail: (v: string) => setEmail(v),
    setOtp: (v: string) => setOtp(v.replace(/\D/g, '').slice(0, OTP_LENGTH)),
    setPassword: (v: string) => setPassword(v),
    setPasswordConfirmation: (v: string) => setPasswordConfirmation(v),
    submit,
  };
}
