import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import { httpClient } from './httpClient';
import { apiErrorFromAxios, makeApiError, type ApiError } from './apiError';

export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

/**
 * `baseQuery` RTK Query berbasis `httpClient` (axios). Semua error dinormalkan
 * ke `ApiError` — sama seperti `guardApi()` di repository Flutter membungkus
 * `DioException` jadi `ApiException`. Body sukses dikembalikan apa adanya;
 * pembongkaran amplop `{ data: ... }` dilakukan lewat `transformResponse`
 * per-endpoint (lihat `apiEnvelope.ts`), setara `requireData()`.
 */
export const axiosBaseQuery = (): BaseQueryFn<AxiosBaseQueryArgs, unknown, ApiError> => {
  return async ({ url, method, data, params }) => {
    try {
      const result = await httpClient.request({ url, method: method ?? 'GET', data, params });
      return { data: result.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: apiErrorFromAxios(error) };
      }
      return {
        error: makeApiError({ message: 'Terjadi kesalahan tak terduga. Coba lagi sebentar.' }),
      };
    }
  };
};
