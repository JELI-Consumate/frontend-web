import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppUser } from '../model/appUser';

/**
 * Setara `AuthController` (AsyncNotifier<AppUser?>) di frontend-android.
 * - `bootstrapped=false` -> AppRoot menampilkan SplashScreen (build() awal).
 * - `user==null` sesudah bootstrap -> alur belum login.
 * Token bearer sendiri dikelola `tokenStorage`, bukan di sini.
 */
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
    /** Sesi berakhir (logout, 401, atau bootstrap tanpa token). */
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
