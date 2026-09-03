import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

/**
 * Satu slice RTK Query untuk seluruh backend. Tiap fitur menambah endpoint-nya
 * lewat `baseApi.injectEndpoints(...)` di `features/<fitur>/api/*` — menjaga
 * definisi HTTP tetap terpisah per fitur tapi berbagi cache & middleware.
 *
 * `tagTypes` = kunci invalidasi lintas endpoint (setara `ref.invalidate(...)`
 * di Riverpod).
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'Sectors', 'SectorDetail', 'JourneyDetail', 'Badges', 'NextProgress'],
  // Padanan web dari pull-to-refresh Flutter: data disegarkan saat tab kembali
  // fokus / koneksi pulih. `setupListeners` dipanggil di `store.ts`.
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
