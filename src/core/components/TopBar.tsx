import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title?: string;
  /** Default: `navigate(-1)`. */
  onBack?: () => void;
  showBack?: boolean;
}

/** Setara `AppBar` dari `app_theme.dart` (bg background, judul di tengah). */
export function TopBar({ title, onBack, showBack = true }: TopBarProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex h-56 items-center bg-background px-xs">
      {showBack ? (
        <button
          type="button"
          aria-label="Kembali"
          onClick={onBack ?? (() => navigate(-1))}
          className="flex h-40 w-40 items-center justify-center text-ink"
        >
          <ArrowLeft size={24} />
        </button>
      ) : (
        <span className="h-40 w-40" />
      )}
      <h1 className="flex-1 text-center text-title-lg text-black">{title}</h1>
      <span className="h-40 w-40" />
    </header>
  );
}
