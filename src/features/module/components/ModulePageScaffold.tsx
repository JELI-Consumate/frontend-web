import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModuleBottomBar, ModuleTopBar } from './moduleChrome';
import type { ModulePageNav } from './modulePageNav';

interface ModulePageScaffoldProps {
  nav: ModulePageNav;
  body: ReactNode;
  footer?: ReactNode;
  backgroundClassName?: string;
  scrollResetKey?: string | number;
}

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
        {isActive && nav.footerSlot && footer != null ? createPortal(footer, nav.footerSlot) : null}
      </div>
    );
  }

  return (
    <div className={`flex h-[100dvh] flex-col overflow-hidden ${backgroundClassName}`}>
      <ModuleTopBar position={nav.modulePosition} total={nav.moduleTotal} onBack={nav.onBack} />
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
