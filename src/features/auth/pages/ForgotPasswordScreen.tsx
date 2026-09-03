import { useNavigate } from 'react-router-dom';
import { Mail, MailCheck } from 'lucide-react';
import { TopBar } from '@/core/components/TopBar';
import { AppTextField } from '@/core/components/AppTextField';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

/** Padanan `forgot_password_screen.dart`. */
export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const form = useForgotPasswordForm();

  return (
    <div className="min-h-full bg-background">
      <TopBar title="Lupa Kata Sandi" onBack={() => navigate('/auth')} />
      <div className="p-screen">
        {form.confirmationMessage == null ? (
          <div className="flex flex-col items-stretch">
            <h2 className="text-title-lg text-black">Masukkan email akunmu</h2>
            <p className="mt-xxs text-body-sm text-ink-muted">
              Kami akan mengirim kode untuk mengatur ulang kata sandi ke email tersebut.
            </p>
            <div className="h-lg" />
            <AppTextField
              value={form.email}
              onChange={form.setEmail}
              hintText="Email"
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="email"
              disabled={form.submitting}
              errorText={form.emailError}
              onSubmit={form.submit}
            />
            <div className="h-lg" />
            <PrimaryButton
              label="Kirim Kode Reset"
              trailingIcon={null}
              isLoading={form.submitting}
              onPressed={form.submit}
            />
          </div>
        ) : (
          <div className="flex flex-col items-stretch">
            <div className="h-xl" />
            <MailCheck size={56} className="mx-auto text-primary" />
            <div className="h-md" />
            <h2 className="text-center text-title-lg text-black">Cek email kamu</h2>
            <p className="mt-xxs text-center text-body-sm text-ink-muted">
              {form.confirmationMessage}
            </p>
            <div className="h-xl" />
            <PrimaryButton
              label="Sudah Punya Kode?"
              trailingIcon={null}
              onPressed={() =>
                navigate('/auth/reset', { state: { email: form.email.trim() } })
              }
            />
            <div className="h-sm" />
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="px-md py-xs text-label-md font-semibold text-primary"
            >
              Kembali ke Masuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
