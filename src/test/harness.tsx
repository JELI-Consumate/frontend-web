import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { baseApi } from '@/api/baseApi';
import { httpClient } from '@/api/httpClient';
import { AlertProvider } from '@/core/components/alert/AlertProvider';
import { authReducer, setUser, markBootstrapped } from '@/features/auth/state/authSlice';
import { onboardingReducer, finishOnboarding } from '@/features/onboarding/state/onboardingSlice';
import {
  activeSectorReducer,
  selectSector,
} from '@/features/onboarding/state/activeSectorSlice';
import { mainTabReducer } from '@/features/main/state/mainTabSlice';
import type { AppUser } from '@/features/auth/model/appUser';

export function makeTestStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      onboarding: onboardingReducer,
      activeSector: activeSectorReducer,
      mainTab: mainTabReducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
}

export type TestStore = ReturnType<typeof makeTestStore>;

export const TEST_USER: AppUser = {
  id: 'u1',
  name: 'Rina',
  email: 'rina@example.com',
  phone: '08123456789',
  dateOfBirth: null,
  avatarUrl: null,
  emailVerifiedAt: '2026-01-01T00:00:00Z',
};

interface RenderOptions {
  store?: TestStore;
  route?: string;
  /** Seed sesi login + sektor aktif + onboarding selesai. */
  authenticated?: boolean;
  activeSectorSlug?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { store = makeTestStore(), route = '/', authenticated = true, activeSectorSlug = 'e-commerce' }: RenderOptions = {},
) {
  store.dispatch(markBootstrapped());
  store.dispatch(finishOnboarding());
  if (authenticated) {
    store.dispatch(setUser(TEST_USER));
    store.dispatch(selectSector(activeSectorSlug));
  }

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="test.apps.googleusercontent.com">
        <MemoryRouter initialEntries={[route]}>
          <AlertProvider>{children}</AlertProvider>
        </MemoryRouter>
      </GoogleOAuthProvider>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper }) };
}

/** MockAdapter yang menempel ke `httpClient`. Panggil `.restore()` di afterEach. */
export function mockHttp(): MockAdapter {
  return new MockAdapter(httpClient, { onNoMatch: 'throwException' });
}

/** Bungkus payload seperti amplop backend `{ data: ... }`. */
export const envelope = <T,>(data: T) => ({ data });
