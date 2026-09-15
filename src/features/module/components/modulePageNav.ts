export interface ModulePageNav {
  modulePosition?: number;
  moduleTotal?: number;
  pageCount: number;
  pageIndex: number;
  activePageIndex?: number;
  onDotTap?: (index: number) => void;
  hasNext: boolean;
  onAdvance: () => void;
  onBack?: () => void;
  chromeHoisted: boolean;
  footerSlot?: HTMLElement | null;
}

export function singlePageNav(onAdvance: () => void): ModulePageNav {
  return { pageCount: 1, pageIndex: 0, hasNext: false, onAdvance, chromeHoisted: false };
}
