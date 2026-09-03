import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Padanan `frontend-android/lib/features/onboarding/application/active_sector_controller.dart`.
 *
 * Sektor yang sedang dipelajari user pada sesi ini. SENGAJA tidak dipersist:
 * satu user bisa belajar banyak sektor. Tiap cold start / login, nilainya
 * kembali `null` dan AppRoot menampilkan SectorSelectionScreen dulu sebelum
 * MainShell. Token auth tetap dipersist terpisah (sesi 30 hari).
 */
interface ActiveSectorState {
  slug: string | null;
}

const initialState: ActiveSectorState = { slug: null };

const activeSectorSlice = createSlice({
  name: 'activeSector',
  initialState,
  reducers: {
    selectSector(state, action: PayloadAction<string>) {
      state.slug = action.payload;
    },
    clearSector(state) {
      state.slug = null;
    },
  },
});

export const { selectSector, clearSector } = activeSectorSlice.actions;
export const activeSectorReducer = activeSectorSlice.reducer;
