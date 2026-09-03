import { useLocation } from 'react-router-dom';
import { Mail, KeyRound, Lock } from 'lucide-react';
import { TopBar } from '@/core/components/TopBar';
import { AppTextField } from '@/core/components/AppTextField';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';

/** Padanan `reset_password_screen.dart`. */
export function ResetPasswordScreen() {
  const location = useLocation();
  const initialEmail = (location.state as { email?: string } | null)?.email;
  const form = useResetPasswordForm(initialEmail);
  const loading = form.submitting;

  return (
    <div className="min-h-full bg-background">
      <TopBar title="Reset Kata Sandi" />
      <div className="p-screen">
        <div className="flex flex-col items-stretch">
          <p className="text-body-sm text-ink-muted">
            Salin kode reset dari email kamu, lalu buat kata sandi baru.
          </p>
          <div className="h-lg" />
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
            value={form.values.otp}
            onChange={form.setOtp}
            hintText="Kode Reset"
            icon={KeyRound}
            type="text"
            inputMode="numeric"
            disabled={loading}
            errorText={form.errors.otp}
          />
          <div className="h-sm" />
          <AppTextField
            value={form.values.password}
            onChange={form.setPassword}
            hintText="Kata Sandi Baru"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            disabled={loading}
            errorText={form.errors.password}
          />
          <div className="h-sm" />
          <AppTextField
            value={form.values.passwordConfirmation}
            onChange={form.setPasswordConfirmation}
            hintText="Konfirmasi Kata Sandi Baru"
            icon={Lock}
            type="password"
            disabled={loading}
            errorText={form.errors.password_confirmation}
            onSubmit={form.submit}
          />
          <div className="h-lg" />
          <PrimaryButton
            label="Reset Kata Sandi"
            trailingIcon={null}
            isLoading={loading}
            onPressed={form.submit}
          />
        </div>
      </div>
    </div>
  );
}
