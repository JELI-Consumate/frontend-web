import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, mockHttp, envelope } from '@/test/harness';
import {
  complaintAgenciesJson,
  complaintAgencyDetailJson,
  complaintCategoriesJson,
} from '@/test/fixtures';
import { ComplaintAgenciesScreen } from './ComplaintAgenciesScreen';
import { ComplaintAgencyDetailScreen } from './ComplaintAgencyDetailScreen';

let mock: MockAdapter;
afterEach(() => mock.restore());

function renderRoutes(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/complaint-agencies" element={<ComplaintAgenciesScreen />} />
      <Route path="/complaint-agencies/:slug" element={<ComplaintAgencyDetailScreen />} />
    </Routes>,
    { route },
  );
}

describe('ComplaintAgenciesScreen', () => {
  it('menampilkan daftar lembaga dari API', async () => {
    mock = mockHttp();
    mock.onGet('/complaint-agencies').reply(200, envelope(complaintAgenciesJson()));
    mock.onGet('/complaint-categories').reply(200, envelope(complaintCategoriesJson()));

    renderRoutes('/complaint-agencies');

    expect(await screen.findByText('Badan Pengawas Obat dan Makanan')).toBeInTheDocument();
    expect(screen.getByText('Yayasan Lembaga Konsumen Indonesia')).toBeInTheDocument();
  });

  it('menampilkan pesan error dan bisa dicoba lagi', async () => {
    mock = mockHttp();
    mock.onGet('/complaint-agencies').replyOnce(500, { message: 'x' });
    mock.onGet('/complaint-agencies').reply(200, envelope(complaintAgenciesJson()));
    mock.onGet('/complaint-categories').reply(200, envelope(complaintCategoriesJson()));

    renderRoutes('/complaint-agencies');

    expect(await screen.findByText('Gagal memuat daftar lembaga.')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Coba lagi'));
    expect(await screen.findByText('Badan Pengawas Obat dan Makanan')).toBeInTheDocument();
  });

  it('panduan masalah membuka lembaga yang relevan lalu ke halaman detail', async () => {
    mock = mockHttp();
    mock.onGet('/complaint-agencies').reply(200, envelope(complaintAgenciesJson()));
    mock.onGet('/complaint-categories').reply(200, envelope(complaintCategoriesJson()));
    mock.onGet('/complaint-agencies/bpom').reply(200, envelope(complaintAgencyDetailJson()));

    renderRoutes('/complaint-agencies');

    await userEvent.click(screen.getByRole('tab', { name: 'Pilih Sesuai Masalah' }));
    await userEvent.click(await screen.findByText('Dugaan produk obat atau makanan ilegal'));
    await userEvent.click(screen.getByRole('button', { name: 'BPOM' }));

    expect(await screen.findByText('Kapan Perlu Menghubungi?')).toBeInTheDocument();
    expect(screen.getByText('Menemukan produk ilegal.')).toBeInTheDocument();
  });
});

describe('ComplaintAgencyDetailScreen', () => {
  it('menampilkan kanal dengan tombol aksi, alamat tanpa tombol', async () => {
    mock = mockHttp();
    mock.onGet('/complaint-agencies/bpom').reply(200, envelope(complaintAgencyDetailJson()));

    renderRoutes('/complaint-agencies/bpom');

    expect(await screen.findByText('WhatsApp Halo BPOM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hubungi Halo BPOM/ })).toBeInTheDocument();
    expect(screen.getByText('Jl. Percetakan Negara')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button').filter((b) => /Hubungi|Buka|Telepon/.test(b.textContent ?? '')),
    ).toHaveLength(1);
  });

  it('tombol kanal membuka URL dari backend', async () => {
    mock = mockHttp();
    mock.onGet('/complaint-agencies/bpom').reply(200, envelope(complaintAgencyDetailJson()));
    const clicked: string[] = [];
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      clicked.push(this.href);
    };

    try {
      renderRoutes('/complaint-agencies/bpom');
      await userEvent.click(await screen.findByRole('button', { name: /Hubungi Halo BPOM/ }));
      await waitFor(() => expect(clicked).toEqual(['https://wa.me/6281191811533']));
    } finally {
      HTMLAnchorElement.prototype.click = click;
    }
  });

  it('menampilkan pesan gagal dan tombol coba lagi saat detail gagal dimuat', async () => {
    mock = mockHttp();
    mock.onGet('/complaint-agencies/xyz').reply(500, { message: 'Server error' });

    renderRoutes('/complaint-agencies/xyz');

    expect(
      await screen.findByText('Gagal memuat detail lembaga. Coba lagi nanti.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Coba lagi')).toBeInTheDocument();
  });

  it('menampilkan info bila lembaga belum punya kanal', async () => {
    mock = mockHttp();
    mock
      .onGet('/complaint-agencies/bpom')
      .reply(200, envelope(complaintAgencyDetailJson({ channels: [] })));

    renderRoutes('/complaint-agencies/bpom');

    expect(await screen.findByText(/Kontak resmi lembaga ini belum tersedia/)).toBeInTheDocument();
  });
});
