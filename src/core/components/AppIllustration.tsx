interface AppIllustrationProps {
  src: string;
  alt?: string;
  maxHeight?: number;
}

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
