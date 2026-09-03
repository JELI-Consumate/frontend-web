import { screen } from '@testing-library/react';
import type MockAdapter from 'axios-mock-adapter';
import { renderWithProviders, mockHttp, envelope } from '@/test/harness';
import { sectorDetailJson, journeyJson } from '@/test/fixtures';
import { DashboardScreen } from './DashboardScreen';

let mock: MockAdapter;
afterEach(() => mock.restore());

describe('DashboardScreen', () => {
  it('kartu pre-test tampil & kartu journey berikutnya disembunyikan saat gerbang pre-test aktif', async () => {
    mock = mockHttp();
    mock.onGet('/sectors/e-commerce').reply(
      200,
      envelope(
        sectorDetailJson({
          surveys: {
            pretest: { link: 'https://forms.gle/x', completed_at: null },
            posttest: { link: null, completed_at: null },
          },
          journeys: [journeyJson({ progress: { status: 'not_started', percent: 0 } })],
        }),
      ),
    );

    renderWithProviders(<DashboardScreen />);

    expect(await screen.findByText('Survei Pre-Test Sektor')).toBeInTheDocument();
    expect(screen.queryByText('Perjalanan')).not.toBeInTheDocument();
  });

  it('menampilkan kartu journey berikutnya saat tidak ada gerbang pre-test', async () => {
    mock = mockHttp();
    mock.onGet('/sectors/e-commerce').reply(
      200,
      envelope(
        sectorDetailJson({
          journeys: [journeyJson({ progress: { status: 'not_started', percent: 0 }, is_unlocked: true })],
        }),
      ),
    );

    renderWithProviders(<DashboardScreen />);

    expect(await screen.findByText('Perjalanan')).toBeInTheDocument();
    expect(screen.getByText('Kenali Hakmu sebagai Konsumen')).toBeInTheDocument();
  });
});
