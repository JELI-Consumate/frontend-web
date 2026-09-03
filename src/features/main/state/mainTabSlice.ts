import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Padanan `main_tab_provider.dart` (MainTabIndexNotifier). */
interface MainTabState {
  index: number;
}

const initialState: MainTabState = { index: 0 };

const mainTabSlice = createSlice({
  name: 'mainTab',
  initialState,
  reducers: {
    selectTab(state, action: PayloadAction<number>) {
      state.index = action.payload;
    },
  },
});

export const { selectTab } = mainTabSlice.actions;
export const mainTabReducer = mainTabSlice.reducer;
