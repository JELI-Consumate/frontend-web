/** Padanan `module_page_nav.dart` (ModulePageNav) — kontrak navigasi 1 halaman modul. */
export interface ModulePageNav {
  modulePosition?: number;
  moduleTotal?: number;
  pageCount: number;
  pageIndex: number;
  /** Indeks halaman yang sedang terlihat (mode hoisted). */
  activePageIndex?: number;
  onDotTap?: (index: number) => void;
  hasNext: boolean;
  onAdvance: () => void;
  /**
   * Aksi tombol back di top bar. Selalu balik ke detail journey (padanan
   * `Navigator.pop` ke `JourneyDetailScreen` di Android), bukan `history.back()`
   * yang mati kalau modul dibuka langsung (refresh / deep link / notifikasi).
   */
  onBack?: () => void;
  /** Kalau true, chrome (top/bottom bar) digambar oleh induk, bukan tiap halaman. */
  chromeHoisted: boolean;
  /**
   * Di mode hoisted: node DOM di bottom bar induk. Halaman yang aktif
   * mem-`createPortal` footer-nya ke sini (tanpa lewat state induk -> tidak ada
   * loop render).
   */
  footerSlot?: HTMLElement | null;
}

export function singlePageNav(onAdvance: () => void): ModulePageNav {
  return { pageCount: 1, pageIndex: 0, hasNext: false, onAdvance, chromeHoisted: false };
}
