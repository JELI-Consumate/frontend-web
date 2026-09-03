import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import { authReducer } from '@/features/auth/state/authSlice';
import { onboardingReducer } from '@/features/onboarding/state/onboardingSlice';
import { activeSectorReducer } from '@/features/onboarding/state/activeSectorSlice';
import { mainTabReducer } from '@/features/main/state/mainTabSlice';
import { AlertProvider } from '@/core/components/alert/AlertProvider';
import { AppRoot } from './AppRoot';

function makeStore() {
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

describe('AppRoot (smoke)', () => {
  it('tanpa token -> selesai bootstrap -> menampilkan onboarding', async () => {
    localStorage.clear();
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <AlertProvider>
            <AppRoot />
          </AlertProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(await screen.findByText('Selamat Datang!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mulai' })).toBeInTheDocument();
  });
});
