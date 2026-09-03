import { makeApiError } from '@/api/apiError';
import { presentAuthError } from './authErrorMapper';

describe('presentAuthError', () => {
  it('menaruh error field yang dikenal sebagai inline', () => {
    const result = presentAuthError(
      makeApiError({ message: 'x', fieldErrors: { email: ['Email salah.'] } }),
      ['email', 'password'],
    );
    expect(result.fieldErrors).toEqual({ email: 'Email salah.' });
    expect(result.message).toBeNull();
  });

  it('menggabungkan error field asing menjadi pesan', () => {
    const result = presentAuthError(
      makeApiError({ message: 'x', fieldErrors: { captcha: ['Wajib captcha.'] } }),
      ['email'],
    );
    expect(result.fieldErrors).toEqual({});
    expect(result.message).toBe('Wajib captcha.');
  });

  it('non-ApiError -> pesan generik', () => {
    const result = presentAuthError(new Error('boom'), []);
    expect(result.message).toContain('tak terduga');
  });
});
