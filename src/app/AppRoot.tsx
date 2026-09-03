import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './hooks';
import { SplashScreen } from './SplashScreen';
import { MainShell } from './MainShell';
import { useBootstrapAuth } from '@/features/auth/hooks/useBootstrapAuth';
import { useAuthBootstrapped, useCurrentUser } from '@/features/auth/hooks/useAuthState';
import { AuthScreen } from '@/features/auth/pages/AuthScreen';
import { ForgotPasswordScreen } from '@/features/auth/pages/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/features/auth/pages/ResetPasswordScreen';
import { OtpVerificationScreen } from '@/features/auth/pages/OtpVerificationScreen';
import { OnboardingScreen } from '@/features/onboarding/pages/OnboardingScreen';
import { SectorSelectionScreen } from '@/features/onboarding/pages/SectorSelectionScreen';
import { JourneyDetailScreen } from '@/features/learning/pages/JourneyDetailScreen';
import { JourneyCelebrationScreen } from '@/features/learning/pages/JourneyCelebrationScreen';
import { ModuleScreen } from '@/features/module/screens/ModuleScreen';

/**
 * Padanan `app_root.dart`: gerbang berlapis
 * splash -> onboarding -> auth -> pilih sektor -> MainShell.
 * Keputusan tingkat atas berbasis state (bukan URL), sama seperti Flutter.
 */
export function AppRoot() {
  useBootstrapAuth();

  const bootstrapped = useAuthBootstrapped();
  const user = useCurrentUser();
  const onboardingDone = useAppSelector((s) => s.onboarding.done);
  const activeSector = useAppSelector((s) => s.activeSector.slug);

  if (!bootstrapped) return <SplashScreen />;

  if (user == null) {
    if (!onboardingDone) return <OnboardingScreen />;
    return (
      <Routes>
        <Route path="/auth/forgot" element={<ForgotPasswordScreen />} />
        <Route path="/auth/reset" element={<ResetPasswordScreen />} />
        <Route path="/auth/otp" element={<OtpVerificationScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="*" element={<AuthScreen />} />
      </Routes>
    );
  }

  if (activeSector == null) return <SectorSelectionScreen />;

  return (
    <Routes>
      <Route path="/journey/:journeyId/module/:moduleId" element={<ModuleScreen />} />
      <Route path="/journey/:id/celebration" element={<JourneyCelebrationScreen />} />
      <Route path="/journey/:id" element={<JourneyDetailScreen />} />
      <Route path="/" element={<MainShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
