import { Spinner } from '@/core/components/Spinner';

export function SplashScreen() {
  return (
    <div className="flex min-h-full items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}
