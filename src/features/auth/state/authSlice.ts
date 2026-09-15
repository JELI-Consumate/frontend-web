import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppUser } from '../model/appUser';

interface AuthState {
  user: AppUser | null;
  bootstrapped: boolean;
}

const initialState: AuthState = {
  user: null,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AppUser>) {
      state.user = action.payload;
    },
    signedOut(state) {
      state.user = null;
    },
    markBootstrapped(state) {
      state.bootstrapped = true;
    },
  },
});

export const { setUser, signedOut, markBootstrapped } = authSlice.actions;
export const authReducer = authSlice.reducer;
