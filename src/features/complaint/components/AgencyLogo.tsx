import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { cn } from '@/core/lib/cn';

interface AgencyLogoProps {
  logoUrl: string | null;
  size?: number;
  className?: string;
}

export function AgencyLogo({ logoUrl, size = 56, className }: AgencyLogoProps) {
  const [imgOk, setImgOk] = useState(true);
  const showImg = logoUrl != null && logoUrl.length > 0 && imgOk;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        <img
          src={logoUrl!}
          alt=""
          className="h-full w-full object-contain p-xxs"
          onError={() => setImgOk(false)}
        />
      ) : (
        <Landmark size={Math.round(size * 0.45)} className="text-primary" />
      )}
    </div>
  );
}
