import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import type MockAdapter from 'axios-mock-adapter';
import { renderWithProviders, mockHttp, envelope } from '@/test/harness';
import { twoPageArticleModuleJson, journeyDetailJson } from '@/test/fixtures';
import { ModuleScreen } from './ModuleScreen';

let mock: MockAdapter;
afterEach(() => mock.restore());

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
});
