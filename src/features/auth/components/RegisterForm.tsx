import { User, Mail, Smartphone, Lock } from 'lucide-react';
import { AppTextField } from '@/core/components/AppTextField';
import { AppDateField } from '@/core/components/AppDateField';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { GoogleButton } from '@/core/components/GoogleButton';
import { LabeledDivider } from '@/core/components/LabeledDivider';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { AuthFooterLink } from './AuthFooterLink';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onGooglePressed: () => void;
  isGoogleLoading?: boolean;
}

/** Padanan `register_form.dart`. */
export function RegisterForm({
  onSwitchToLogin,
  onGooglePressed,
  isGoogleLoading = false,
}: RegisterFormProps) {
  const form = useRegisterForm();
  const loading = form.submitting;

  return (
    <div className="flex flex-col items-stretch">
      <AppTextField
        value={form.values.name}
        onChange={form.setName}
        hintText="Nama Lengkap"
        icon={User}
        autoComplete="name"
        disabled={loading}
        errorText={form.errors.name}
      />
      <div className="h-sm" />
      <AppTextField
        value={form.values.email}
        onChange={form.setEmail}
        hintText="Email"
        icon={Mail}
        type="email"
        inputMode="email"
        autoComplete="email"
        disabled={loading}
        errorText={form.errors.email}
      />
      <div className="h-sm" />
      <AppTextField
        value={form.values.phone}
        onChange={form.setPhone}
        hintText="Nomor HP"
        icon={Smartphone}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        disabled={loading}
        errorText={form.errors.phone}
      />
      <div className="h-sm" />
      <AppDateField
        value={form.values.dateOfBirth}
        onChange={form.setDateOfBirth}
        hintText="Tanggal Lahir"
        disabled={loading}
        errorText={form.errors.date_of_birth}
        min={new Date(new Date().getFullYear() - 120, 0, 1)}
      />
      <div className="h-sm" />
      <AppTextField
        value={form.values.password}
        onChange={form.setPassword}
        hintText="Kata sandi"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        disabled={loading}
        errorText={form.errors.password}
        helperText="Kata sandi minimal 8 karakter."
      />
      <div className="h-sm" />
      <AppTextField
        value={form.values.passwordConfirmation}
        onChange={form.setPasswordConfirmation}
        hintText="Konfirmasi Kata sandi"
        icon={Lock}
        type="password"
        disabled={loading}
        errorText={form.errors.password_confirmation ?? form.confirmPasswordLiveError}
        onSubmit={form.submit}
      />
      <div className="h-md" />
      <PrimaryButton
        label="Daftar"
        trailingIcon={null}
        isLoading={loading}
        onPressed={form.submit}
      />
      <div className="h-lg" />
      <LabeledDivider label="atau daftar dengan" />
      <div className="h-md" />
      <GoogleButton
        onPressed={loading || isGoogleLoading ? null : onGooglePressed}
        isLoading={isGoogleLoading}
      />
      <div className="h-xs" />
      <AuthFooterLink
        question="Sudah punya akun?"
        action="Masuk di sini"
        onTap={onSwitchToLogin}
      />
    </div>
  );
}
