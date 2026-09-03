import { Hammer } from 'lucide-react';

/** Penanda sementara untuk layar yang belum diport (iterasi berikutnya). */
export function PlaceholderNotice({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="flex h-56 items-center justify-center bg-background">
        <h1 className="text-title-lg text-black">{title}</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-sm p-lg text-center">
        <Hammer size={40} className="text-muted" />
        <p className="text-body-sm text-ink-muted">
          {note ?? 'Layar ini menyusul di iterasi berikutnya (setelah slice ini di-review).'}
        </p>
      </div>
    </div>
  );
}
