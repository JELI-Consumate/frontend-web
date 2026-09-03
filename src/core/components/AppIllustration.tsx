interface AppIllustrationProps {
  /** Path di bawah `/images/...`. */
  src: string;
  alt?: string;
  maxHeight?: number;
}

/** Setara `frontend-android/lib/core/widgets/app_illustration.dart`. */
export function AppIllustration({ src, alt, maxHeight = 350 }: AppIllustrationProps) {
  return (
    <img
      src={src}
      alt={alt ?? ''}
      aria-hidden={alt == null}
      className="mx-auto w-full object-contain"
      style={{ maxHeight }}
    />
  );
}
