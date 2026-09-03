import type { ComponentType } from 'react';
import {
  ShoppingCart,
  HeartPulse,
  Bus,
  Home,
  Landmark,
  Pill,
  MonitorSmartphone,
  Zap,
  LayoutGrid,
  type LucideProps,
} from 'lucide-react';
import { colors } from '@/core/theme/tokens';

/** Setara `sectorColor(String? hex)` di `sector_selection_screen.dart`. */
export function sectorColor(hex: string | null | undefined): string {
  if (!hex || hex.length === 0) return colors.primary;
  const normalized = hex.replace(/^#/, '').trim();
  if (!/^[0-9a-fA-F]+$/.test(normalized)) return colors.primary;
  if (normalized.length === 6) return `#${normalized}`;
  if (normalized.length === 8) {
    // Flutter memakai AARRGGBB; CSS memakai RRGGBBAA.
    const aa = normalized.slice(0, 2);
    const rrggbb = normalized.slice(2);
    return `#${rrggbb}${aa}`;
  }
  return colors.primary;
}

/** Setara `sectorIcon(String name)` di `sector_selection_screen.dart`. */
export function sectorIcon(name: string): ComponentType<LucideProps> {
  const n = name.toLowerCase();
  const has = (keys: string[]) => keys.some((k) => n.includes(k));

  if (has(['commerce', 'belanja', 'transaksi jual'])) return ShoppingCart;
  if (has(['kesehatan', 'medis', 'rumah sakit'])) return HeartPulse;
  if (has(['transport'])) return Bus;
  if (has(['perumahan', 'sanitasi', 'air'])) return Home;
  if (has(['keuangan', 'asuransi', 'bank'])) return Landmark;
  if (has(['obat', 'kosmetik', 'makanan', 'farmasi'])) return Pill;
  if (has(['elektronik', 'telematika', 'kendaraan', 'otomotif'])) return MonitorSmartphone;
  if (has(['listrik', 'bbm', 'gas', 'energi'])) return Zap;
  return LayoutGrid;
}
