import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/harness';
import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
  it('submit kosong menampilkan pesan validasi', async () => {
    renderWithProviders(<AuthScreen />, { authenticated: false });

    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Email wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Kata sandi wajib diisi.')).toBeInTheDocument();
  });

  it('email tidak valid ditolak sebelum request', async () => {
    renderWithProviders(<AuthScreen />, { authenticated: false });

    await userEvent.type(screen.getByPlaceholderText('Email'), 'bukan-email');
    await userEvent.type(screen.getByPlaceholderText('Kata sandi'), 'rahasia12');
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Format email belum benar.')).toBeInTheDocument();
  });

  it('tab Daftar bisa dibuka', async () => {
    renderWithProviders(<AuthScreen />, { authenticated: false });

    await userEvent.click(screen.getByRole('tab', { name: 'Daftar' }));

    expect(await screen.findByPlaceholderText('Nama Lengkap')).toBeInTheDocument();
  });
});
