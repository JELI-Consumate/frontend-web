import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import type MockAdapter from 'axios-mock-adapter';
import { renderWithProviders, mockHttp, envelope } from '@/test/harness';
import { journeyDetailJson, sectorDetailJson } from '@/test/fixtures';
import { JourneyDetailScreen } from './JourneyDetailScreen';

let mock: MockAdapter;
afterEach(() => mock.restore());

describe('JourneyDetailScreen', () => {
  it('menampilkan judul journey, progres, dan daftar modul', async () => {
    mock = mockHttp();
    mock.onGet('/journeys/j1').reply(200, envelope(journeyDetailJson()));
    mock.onGet('/sectors/e-commerce').reply(200, envelope(sectorDetailJson()));

    renderWithProviders(
      <Routes>
        <Route path="/journey/:id" element={<JourneyDetailScreen />} />
      </Routes>,
      { route: '/journey/j1' },
    );

    expect(
      await screen.findByRole('heading', { name: 'Kenali Hakmu sebagai Konsumen' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Progres Belajar')).toBeInTheDocument();
    expect(screen.getByText('1. Mengenal Hak Dasar')).toBeInTheDocument();
  });
});
