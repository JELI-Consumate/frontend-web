import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SegmentedTabs } from '@/core/components/SegmentedTabs';
import { AuthHeader } from '../components/AuthHeader';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

type Tab = 'login' | 'register';

/** Padanan `auth_screen.dart`. */
export function AuthScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');
  const { handleGoogle, submitting: googleSubmitting } = useGoogleAuth();

  return (
    <div className="min-h-full bg-background">
      <div className="flex flex-col items-stretch">
        <AuthHeader />
        <div className="px-screen pb-xl pt-xs">
          <SegmentedTabs
            labels={['Masuk', 'Daftar']}
            activeIndex={tab === 'login' ? 0 : 1}
            onChange={(index) => setTab(index === 0 ? 'login' : 'register')}
          />
          <div className="h-lg" />
          {tab === 'login' ? (
            <LoginForm
              onSwitchToRegister={() => setTab('register')}
              onGooglePressed={handleGoogle}
              isGoogleLoading={googleSubmitting}
              onForgotPassword={() => navigate('/auth/forgot')}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={() => setTab('login')}
              onGooglePressed={handleGoogle}
              isGoogleLoading={googleSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
