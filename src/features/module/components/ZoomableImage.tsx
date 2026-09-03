import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ImageOff } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import { Spinner } from '@/core/components/Spinner';

interface ZoomableImageProps {
  url: string;
  aspectRatio?: number;
  rounded?: boolean;
}

/** Padanan `zoomable_image.dart`: gambar konten, ketuk untuk lihat layar penuh. */
export function ZoomableImage({ url, aspectRatio = 4 / 3, rounded = true }: ZoomableImageProps) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [full, setFull] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => state === 'ok' && setFull(true)}
        className={cn('block w-full overflow-hidden', rounded && 'rounded-lg')}
      >
        {state === 'error' ? (
          <div
            className="flex items-center justify-center bg-background"
            style={{ aspectRatio }}
          >
            <ImageOff className="text-muted" />
          </div>
        ) : (
          <>
            {state === 'loading' ? (
              <div className="flex items-center justify-center bg-background" style={{ aspectRatio }}>
                <Spinner size={24} />
              </div>
            ) : null}
            <img
              src={url}
              alt=""
              onLoad={() => setState('ok')}
              onError={() => setState('error')}
              className={cn('w-full object-contain', state !== 'ok' && 'hidden')}
            />
          </>
        )}
      </button>

      {full
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-md"
              onClick={() => setFull(false)}
            >
              <img
                src={url}
                alt=""
                className="max-h-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setFull(false)}
                className="absolute right-xs top-xs flex h-40 w-40 items-center justify-center rounded-full bg-black/45 text-white"
              >
                <X size={26} />
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
