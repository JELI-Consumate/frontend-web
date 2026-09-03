import { screen } from '@testing-library/react';
import type MockAdapter from 'axios-mock-adapter';
import { renderWithProviders, mockHttp, envelope } from '@/test/harness';
import { sectorDetailJson, badgesJson } from '@/test/fixtures';
import { BadgesScreen } from './BadgesScreen';

let mock: MockAdapter;
afterEach(() => mock.restore());

describe('BadgesScreen', () => {
  it('hanya menampilkan badge dari journey di sektor aktif', async () => {
    mock = mockHttp();
    mock.onGet('/sectors/e-commerce').reply(200, envelope(sectorDetailJson()));
    mock.onGet('/badges').reply(200, envelope(badgesJson()));

    renderWithProviders(<BadgesScreen />);

    expect(await screen.findByText('Consumer Rights Explorer')).toBeInTheDocument();
    expect(screen.queryByText('Badge Sektor Lain')).not.toBeInTheDocument();
    expect(screen.getByText('1/1 Lencana diraih')).toBeInTheDocument();
  });
});
