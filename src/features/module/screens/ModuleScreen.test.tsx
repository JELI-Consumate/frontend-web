import { Route, Routes, useLocation } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type MockAdapter from 'axios-mock-adapter';
import { renderWithProviders, mockHttp, envelope } from '@/test/harness';
import { twoPageArticleModuleJson, journeyDetailJson, moduleDetailJson } from '@/test/fixtures';
import { ModuleScreen } from './ModuleScreen';

let mock: MockAdapter;
afterEach(() => mock.restore());

function LocationProbe() {
  return <div data-testid="pathname">{useLocation().pathname}</div>;
}

describe('ModuleScreen (modul multi-halaman)', () => {
  it('menggambar chrome hoisted + footer halaman aktif tanpa loop render', async () => {
    mock = mockHttp();
    mock.onGet('/modules/m1').reply(200, envelope(twoPageArticleModuleJson()));
    mock.onGet('/journeys/j1').reply(
      200,
      envelope(journeyDetailJson({ modules: [{ id: 'm1', type: 'materi', title: 'Dua Halaman', description: null, order: 1, estimated_minutes: 8, is_required: true, progress: { status: 'not_started', percent: 0 }, locked: false, pages: [{ id: 'p1' }, { id: 'p2' }] }] })),
    );

    renderWithProviders(
      <Routes>
        <Route path="/journey/:journeyId/module/:moduleId" element={<ModuleScreen />} />
      </Routes>,
      { route: '/journey/j1/module/m1' },
    );

    // Konten halaman 1 tampil, footer (di-portal) menampilkan "Selanjutnya".
    expect(await screen.findByText('Isi halaman satu.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selanjutnya/ })).toBeInTheDocument();
    // Modul 1/1 di top bar (journeyModuleIds punya 1 modul).
    expect(screen.getByText('Modul 1/1')).toBeInTheDocument();
  });

  it('tombol Kembali balik ke detail journey walau modul dibuka langsung (tanpa history)', async () => {
    mock = mockHttp();
    mock.onGet('/modules/m1').reply(200, envelope(moduleDetailJson()));
    mock.onGet('/journeys/j1').reply(200, envelope(journeyDetailJson()));

    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LocationProbe />
        <Routes>
          <Route path="/journey/:journeyId/module/:moduleId" element={<ModuleScreen />} />
          <Route path="/journey/:id" element={<div>DETAIL JOURNEY</div>} />
        </Routes>
      </>,
      // entri tunggal -> `history.back()` tak punya ke mana pun (kasus refresh /
      // deep link / notifikasi).
      { route: '/journey/j1/module/m1' },
    );

    await screen.findByText('Konsumen berhak atas keamanan.');
    await user.click(screen.getByRole('button', { name: 'Kembali' }));

    await waitFor(() => expect(screen.getByText('DETAIL JOURNEY')).toBeInTheDocument());
    expect(screen.getByTestId('pathname').textContent).toBe('/journey/j1');
  });
});
