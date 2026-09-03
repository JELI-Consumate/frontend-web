import { AxiosError, AxiosHeaders } from 'axios';
import { apiErrorFromAxios, isEmailNotVerified, isValidation } from './apiError';

function axiosErrorWith(status: number, data: unknown): AxiosError {
  const err = new AxiosError('failed', 'ERR_BAD_REQUEST');
  err.response = {
    status,
    data,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
  return err;
}

describe('apiErrorFromAxios', () => {
  it('memetakan errors 422 ke fieldErrors + pesan', () => {
    const result = apiErrorFromAxios(
      axiosErrorWith(422, {
        message: 'Data tidak valid.',
        errors: { email: ['Email sudah dipakai.'], password: ['Terlalu pendek.'] },
      }),
    );
    expect(isValidation(result)).toBe(true);
    expect(result.fieldErrors.email).toEqual(['Email sudah dipakai.']);
    expect(result.message).toBe('Data tidak valid.');
  });

  it('membawa business code dari body', () => {
    const result = apiErrorFromAxios(
      axiosErrorWith(403, { message: 'Belum verifikasi.', code: 'EMAIL_NOT_VERIFIED' }),
    );
    expect(isEmailNotVerified(result)).toBe(true);
  });

  it('memakai pesan status saat body bukan objek', () => {
    const result = apiErrorFromAxios(axiosErrorWith(500, 'oops'));
    expect(result.statusCode).toBe(500);
    expect(result.message).toContain('Server sedang bermasalah');
  });

  it('memberi pesan jaringan saat tidak ada response', () => {
    const err = new AxiosError('network', AxiosError.ERR_NETWORK);
    const result = apiErrorFromAxios(err);
    expect(result.message).toContain('Tidak bisa terhubung ke server');
  });
});
