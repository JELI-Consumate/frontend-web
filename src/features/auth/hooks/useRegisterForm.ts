import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/core/components/alert/useAlert';
import { useRegisterMutation } from '../api/authApi';
import { presentAuthError } from '../lib/authErrorMapper';
import { EMAIL_PATTERN, PASSWORD_MISMATCH_MESSAGE } from '../lib/validators';

const KNOWN_FIELDS = ['name', 'email', 'phone', 'date_of_birth', 'password'] as const;

/** Padanan `_RegisterFormState` di `register_form.dart`. */
export function useRegisterForm() {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function clearError(key: string) {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const confirmPasswordLiveError = useMemo(() => {
    if (passwordConfirmation.length === 0) return null;
    if (passwordConfirmation === password) return null;
    return PASSWORD_MISMATCH_MESSAGE;
  }, [password, passwordConfirmation]);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (name.trim().length === 0) next.name = 'Nama lengkap wajib diisi.';

    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) next.email = 'Email wajib diisi.';
    else if (!EMAIL_PATTERN.test(trimmedEmail)) next.email = 'Format email belum benar.';

    if (phone.trim().length === 0) next.phone = 'Nomor HP wajib diisi.';

    if (!dateOfBirth) next.date_of_birth = 'Tanggal lahir wajib diisi.';
    else if (dateOfBirth.getTime() > Date.now())
      next.date_of_birth = 'Tanggal lahir tidak boleh lebih dari hari ini.';

    if (password.length === 0) next.password = 'Kata sandi wajib diisi.';
    else if (password.length < 8) next.password = 'Kata sandi minimal 8 karakter.';

    if (passwordConfirmation !== password)
      next.password_confirmation = PASSWORD_MISMATCH_MESSAGE;

    return next;
  }

  async function submit(): Promise<void> {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const trimmedEmail = email.trim();
    try {
      await register({
        name: name.trim(),
        email: trimmedEmail,
        password,
        phone: phone.trim(),
        dateOfBirth: dateOfBirth ?? undefined,
      }).unwrap();
      navigate('/auth/otp', { state: { email: trimmedEmail } });
    } catch (error) {
      const presentation = presentAuthError(error, KNOWN_FIELDS);
      setErrors(presentation.fieldErrors);
      if (presentation.message) {
        void showAlert({
          type: 'error',
          title: 'Pendaftaran Gagal',
          message: presentation.message,
        });
      }
    }
  }

  return {
    values: { name, email, phone, dateOfBirth, password, passwordConfirmation },
    errors,
    confirmPasswordLiveError,
    submitting: isLoading,
    setName,
    setEmail,
    setPhone: (v: string) => setPhone(v.replace(/[^0-9+\-\s]/g, '').slice(0, 20)),
    setDateOfBirth: (v: Date | null) => {
      setDateOfBirth(v);
      clearError('date_of_birth');
    },
    setPassword: (v: string) => {
      setPassword(v);
      clearError('password');
    },
    setPasswordConfirmation: (v: string) => {
      setPasswordConfirmation(v);
      clearError('password_confirmation');
    },
    submit,
  };
}
