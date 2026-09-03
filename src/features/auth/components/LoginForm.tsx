import { Mail, Lock } from 'lucide-react';
import { AppTextField } from '@/core/components/AppTextField';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { GoogleButton } from '@/core/components/GoogleButton';
import { LabeledDivider } from '@/core/components/LabeledDivider';
import { useLoginForm } from '../hooks/useLoginForm';
import { AuthFooterLink } from './AuthFooterLink';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onGooglePressed: () => void;
  isGoogleLoading?: boolean;
  onForgotPassword: () => void;
}

/** Padanan `login_form.dart`. */
export function LoginForm({
  onSwitchToRegister,
  onGooglePressed,
  isGoogleLoading = false,
  onForgotPassword,
}: LoginFormProps) {
  const form = useLoginForm();
  const loading = form.submitting;

  return (
    <div className="flex flex-col items-stretch">
      <AppTextField
        value={form.email}
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
        value={form.password}
        onChange={form.setPassword}
        hintText="Kata sandi"
        icon={Lock}
        type="password"
        autoComplete="current-password"
        disabled={loading}
        errorText={form.errors.password}
        onSubmit={form.submit}
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={onForgotPassword}
          className="px-xs py-sm text-body-sm font-semibold text-primary disabled:opacity-50"
        >
          Lupa kata sandi?
        </button>
      </div>
      <div className="h-xs" />
      <PrimaryButton
        label="Masuk"
        trailingIcon={null}
        isLoading={loading}
        onPressed={form.submit}
      />
      <div className="h-lg" />
      <LabeledDivider label="atau masuk dengan" />
      <div className="h-md" />
      <GoogleButton
        onPressed={loading || isGoogleLoading ? null : onGooglePressed}
        isLoading={isGoogleLoading}
      />
      <div className="h-xs" />
      <AuthFooterLink
        question="Belum punya akun?"
        action="Daftar di sini"
        onTap={onSwitchToRegister}
      />
    </div>
  );
}
