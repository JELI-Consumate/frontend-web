import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'Sectors', 'SectorDetail', 'JourneyDetail', 'Badges', 'NextProgress'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
