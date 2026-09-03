import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { OtpBoxInput } from '../components/OtpBoxInput';
import { useOtpVerification } from '../hooks/useOtpVerification';
import { OTP_LENGTH } from '../lib/validators';

/** Padanan `otp_verification_screen.dart`. */
export function OtpVerificationScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string } | null)?.email;

  if (!email) return <Navigate to="/auth" replace />;
  return <OtpVerificationBody email={email} onBack={() => navigate('/auth')} />;
}

function OtpVerificationBody({ email, onBack }: { email: string; onBack: () => void }) {
  const otp = useOtpVerification(email);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto flex min-h-full max-w-app flex-col justify-center p-screen">
        <div className="mx-auto flex h-96 w-96 items-center justify-center rounded-full bg-background">
          <MailCheck size={44} className="text-primary" />
        </div>
        <div className="h-lg" />
        <h1 className="text-center text-title-lg text-black">Masukkan Kode OTP</h1>
        <div className="h-xs" />
        <p className="text-center text-body-sm text-ink-muted">
          Kami sudah mengirim kode {OTP_LENGTH} digit ke{' '}
          <span className="font-bold text-ink">{email}</span>. Masukkan kode itu untuk
          mengaktifkan akunmu.
        </p>
        <div className="h-xl" />
        <OtpBoxInput
          key={otp.boxesResetToken}
          length={OTP_LENGTH}
          enabled={!otp.verifying}
          hasError={otp.error != null}
          onChange={otp.setCode}
          onCompleted={(code) => void otp.verify(code)}
        />
        {otp.error ? (
          <>
            <div className="h-sm" />
            <p className="text-center text-body-sm text-danger">{otp.error}</p>
          </>
        ) : null}
        <div className="h-lg" />
        <PrimaryButton
          label="Verifikasi"
          trailingIcon={null}
          isLoading={otp.verifying}
          onPressed={() => void otp.verify()}
        />
        <div className="h-xs" />
        <button
          type="button"
          disabled={!otp.canResend}
          onClick={() => void otp.resend()}
          className="px-md py-xs text-label-md font-semibold text-primary disabled:opacity-50"
        >
          {otp.cooldownSeconds > 0
            ? `Kirim Ulang Kode (${otp.cooldownSeconds}s)`
            : 'Kirim Ulang Kode'}
        </button>
        <div className="h-lg" />
        <button
          type="button"
          onClick={onBack}
          className="px-md py-xs text-body-sm text-ink-muted"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
