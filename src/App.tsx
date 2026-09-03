import { GoogleOAuthProvider } from '@react-oauth/google';
import { AlertProvider } from '@/core/components/alert/AlertProvider';
import { AppRoot } from '@/app/AppRoot';
import { GOOGLE_CLIENT_ID } from '@/features/auth/hooks/useGoogleAuth';

/** Padanan `MyApp` di `main.dart`. Shell mobile-first: lebar konten dibatasi. */
export function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'unconfigured.apps.googleusercontent.com'}>
      <AlertProvider>
        <div className="mx-auto min-h-full w-full max-w-app bg-background">
          <AppRoot />
        </div>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}
