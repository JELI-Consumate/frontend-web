import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/api/baseApi';
import { setUnauthorizedHandler } from '@/api/httpClient';
import { authReducer, signedOut } from '@/features/auth/state/authSlice';
import { onboardingReducer } from '@/features/onboarding/state/onboardingSlice';
import {
  activeSectorReducer,
  clearSector,
} from '@/features/onboarding/state/activeSectorSlice';
import { mainTabReducer } from '@/features/main/state/mainTabSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    onboarding: onboardingReducer,
    activeSector: activeSectorReducer,
    mainTab: mainTabReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

// Interceptor 401 di httpClient sudah membuang token; di sini kita samakan
// state Redux-nya (setara AuthController yang state-nya jadi null) supaya
// AppRoot langsung kembali ke alur login. Cache RTK Query juga direset.
setUnauthorizedHandler(() => {
  store.dispatch(signedOut());
  store.dispatch(clearSector());
  store.dispatch(baseApi.util.resetApiState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
