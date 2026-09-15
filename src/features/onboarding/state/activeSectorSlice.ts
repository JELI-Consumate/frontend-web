import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
