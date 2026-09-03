import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModuleBottomBar, ModuleTopBar } from './moduleChrome';
import type { ModulePageNav } from './modulePageNav';

interface ModulePageScaffoldProps {
  nav: ModulePageNav;
  body: ReactNode;
  footer?: ReactNode;
  /** Kelas latar (default: background). */
  backgroundClassName?: string;
  /**
   * Saat nilai ini berubah, body di-scroll kembali ke atas — dipakai kuis yang
   * mengganti soal di dalam satu halaman modul.
   */
  scrollResetKey?: string | number;
}

/**
 * Padanan `module_page_scaffold.dart`.
 *
 * - Modul 1 halaman: frame setinggi viewport — header & footer diam
 *   (`shrink-0`), hanya body yang di-scroll.
 * - Modul >1 halaman (`chromeHoisted`): body saja; footer di-`portal` ke slot
 *   bottom bar milik induk, HANYA untuk halaman aktif — jadi top/bottom bar
 *   tidak ikut menggeser saat swipe antar-halaman. Frame + scroll body
 *   disediakan oleh `ContentRouter`.
 */
export function ModulePageScaffold({
  nav,
  body,
  footer,
  backgroundClassName = 'bg-background',
  scrollResetKey,
}: ModulePageScaffoldProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [scrollResetKey]);

  if (nav.chromeHoisted) {
    const isActive = nav.pageIndex === nav.activePageIndex;
    return (
      <div className={`min-h-full ${backgroundClassName}`}>
        {body}
        {isActive && nav.footerSlot && footer != null
          ? createPortal(footer, nav.footerSlot)
          : null}
      </div>
    );
  }

  return (
    <div className={`flex h-[100dvh] flex-col overflow-hidden ${backgroundClassName}`}>
      <ModuleTopBar position={nav.modulePosition} total={nav.moduleTotal} />
      <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {body}
      </div>
      {footer != null ? (
        <ModuleBottomBar
          pageCount={nav.pageCount}
          pageIndex={nav.pageIndex}
          onDotTap={nav.onDotTap}
        >
          {footer}
        </ModuleBottomBar>
      ) : null}
    </div>
  );
}
