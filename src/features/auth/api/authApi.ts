import { baseApi } from '@/api/baseApi';
import { requireData, metaMessage } from '@/api/apiEnvelope';
import { makeApiError, isUnauthorized, toApiError } from '@/api/apiError';
import { httpClient } from '@/api/httpClient';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { formatApiDate } from '@/core/lib/dateFormat';
import { parseAppUser, type AppUser } from '../model/appUser';
import { setUser, signedOut } from '../state/authSlice';
import { clearSector } from '@/features/onboarding/state/activeSectorSlice';
import type { AppDispatch } from '@/app/store';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  clearAvatar?: boolean;
  clearDateOfBirth?: boolean;
}

/**
 * Setara `AuthRepository._consumeAuthResult`: menyimpan token (efek samping,
 * seperti di Flutter) lalu mengembalikan user.
 */
function consumeAuthResult(raw: unknown): AppUser {
  const data = requireData(raw);
  const token = data['token'];
  if (typeof token !== 'string' || token.length === 0) {
    throw makeApiError({ message: 'Server tidak mengirim token. Hubungi pengembang.' });
  }
  tokenStorage.save(token);

  const user = data['user'];
  if (typeof user !== 'object' || user === null) {
    throw makeApiError({ message: 'Format data pengguna tidak dikenali.' });
  }
  return parseAppUser(user as Record<string, unknown>);
}

/** `AuthController._startFreshSession`: reset sektor sesi lalu set user. */
function startFreshSession(dispatch: AppDispatch, user: AppUser): void {
  dispatch(clearSector());
  dispatch(setUser(user));
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<AppUser, void>({
      query: () => ({ url: '/auth/me' }),
      transformResponse: (raw) => parseAppUser(requireData(raw)),
      providesTags: ['Auth'],
    }),

    register: build.mutation<void, RegisterInput>({
      query: ({ name, email, password, phone, dateOfBirth }) => ({
        url: '/auth/register',
        method: 'POST',
        data: {
          name,
          email,
          password,
          ...(phone && phone.length > 0 ? { phone } : {}),
          ...(dateOfBirth ? { date_of_birth: formatApiDate(dateOfBirth) } : {}),
        },
      }),
      transformResponse: () => undefined,
    }),

    login: build.mutation<AppUser, LoginInput>({
      query: (body) => ({ url: '/auth/login', method: 'POST', data: body }),
      transformResponse: consumeAuthResult,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        startFreshSession(dispatch, data);
      },
    }),

    loginWithGoogle: build.mutation<AppUser, string>({
      query: (accessToken) => ({
        url: '/auth/google',
        method: 'POST',
        data: { access_token: accessToken },
      }),
      transformResponse: consumeAuthResult,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        startFreshSession(dispatch, data);
      },
    }),

    verifyOtp: build.mutation<AppUser, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-email', method: 'POST', data: body }),
      transformResponse: consumeAuthResult,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        startFreshSession(dispatch, data);
      },
    }),

    resendOtp: build.mutation<string, string>({
      query: (email) => ({
        url: '/auth/verify-email/resend',
        method: 'POST',
        data: { email },
      }),
      transformResponse: (raw) =>
        metaMessage(raw) ??
        'Jika email terdaftar dan belum diverifikasi, kode OTP baru telah dikirim.',
    }),

    forgotPassword: build.mutation<string, string>({
      query: (email) => ({ url: '/auth/forgot-password', method: 'POST', data: { email } }),
      transformResponse: (raw) =>
        metaMessage(raw) ?? 'Jika email terdaftar, kode reset kata sandi telah dikirim.',
    }),

    resetPassword: build.mutation<string, ResetPasswordInput>({
      query: ({ email, otp, password, passwordConfirmation }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data: {
          email,
          otp,
          password,
          password_confirmation: passwordConfirmation,
        },
      }),
      transformResponse: (raw) => metaMessage(raw) ?? 'Kata sandi berhasil direset.',
    }),

    updateProfile: build.mutation<AppUser, UpdateProfileInput>({
      query: ({ name, avatarUrl, dateOfBirth, clearAvatar, clearDateOfBirth }) => {
        const data: Record<string, unknown> = {};
        if (name != null) data['name'] = name;
        if (avatarUrl != null) data['avatar_url'] = avatarUrl;
        if (clearAvatar) data['avatar_url'] = null;
        if (dateOfBirth) data['date_of_birth'] = formatApiDate(dateOfBirth);
        if (clearDateOfBirth) data['date_of_birth'] = null;
        return { url: '/auth/profile', method: 'PATCH', data };
      },
      transformResponse: (raw) => parseAppUser(requireData(raw)),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(data));
      },
    }),

    logout: build.mutation<void, void>({
      // Setara `AuthRepository.logout`: 401 dianggap sukses; error lain
      // diteruskan; token SELALU dibuang di akhir.
      queryFn: async () => {
        try {
          await httpClient.post('/auth/logout');
          return { data: undefined };
        } catch (error) {
          const apiError = toApiError(error);
          if (isUnauthorized(apiError)) return { data: undefined };
          return { error: apiError };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          /* error non-401 sudah ditangani pemanggil */
        } finally {
          tokenStorage.clear();
          dispatch(signedOut());
          dispatch(clearSector());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useLazyGetMeQuery,
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;
