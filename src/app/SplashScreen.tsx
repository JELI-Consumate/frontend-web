import { Spinner } from '@/core/components/Spinner';

/** Padanan `splash_screen.dart`. */
export function SplashScreen() {
  return (
    <div className="flex min-h-full items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}
