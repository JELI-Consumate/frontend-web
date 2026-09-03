import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isApiError, isInvalidOtp, isThrottled } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { useResendOtpMutation, useVerifyOtpMutation } from '../api/authApi';
import { OTP_LENGTH } from '../lib/validators';

const COOLDOWN_SECONDS = 30;

/** Padanan `_OtpVerificationScreenState`. */
export function useOtpVerification(email: string) {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const [code, setCode] = useState('');
  /** Ganti key -> remount kotak OTP (setara `_boxesResetToken`). */
  const [boxesResetToken, setBoxesResetToken] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    if (timerRef.current != null) window.clearInterval(timerRef.current);
    setCooldownSeconds(COOLDOWN_SECONDS);
    timerRef.current = window.setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1 && timerRef.current != null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const verify = useCallback(
    async (submitted?: string) => {
      if (verifying) return;
      const otp = submitted ?? code;
      if (otp.length !== OTP_LENGTH) {
        setError(`Kode OTP harus ${OTP_LENGTH} digit.`);
        return;
      }

      setError(null);
      setVerifying(true);
      try {
        await verifyOtp({ email, otp }).unwrap();
        navigate('/auth'); // user ter-set -> AppRoot pindah ke pilih sektor
      } catch (caught) {
        if (isApiError(caught)) {
          setError(
            isInvalidOtp(caught) ? 'Kode OTP salah atau sudah kedaluwarsa.' : caught.message,
          );
        } else {
          setError('Tidak bisa memverifikasi kode. Coba lagi.');
        }
        setCode('');
        setBoxesResetToken((t) => t + 1);
      } finally {
        setVerifying(false);
      }
    },
    [verifying, code, verifyOtp, email, navigate],
  );

  const resend = useCallback(async () => {
    setResending(true);
    try {
      const message = await resendOtp(email).unwrap();
      startCooldown();
      void showAlert({ type: 'success', title: 'Kode Terkirim', message });
    } catch (caught) {
      if (isApiError(caught)) {
        void showAlert({
          type: isThrottled(caught) ? 'warning' : 'error',
          title: 'Gagal Mengirim Ulang',
          message: caught.message,
        });
      } else {
        void showAlert({
          type: 'error',
          title: 'Gagal Mengirim Ulang',
          message: 'Tidak bisa mengirim ulang kode OTP. Coba lagi.',
        });
      }
    } finally {
      setResending(false);
    }
  }, [resendOtp, email, startCooldown, showAlert]);

  return {
    code,
    boxesResetToken,
    error,
    verifying,
    resending,
    cooldownSeconds,
    canResend: !resending && cooldownSeconds <= 0,
    setCode: (value: string) => {
      setCode(value);
      if (error) setError(null);
    },
    verify,
    resend,
  };
}
