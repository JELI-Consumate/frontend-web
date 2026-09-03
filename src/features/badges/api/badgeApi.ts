import { baseApi } from '@/api/baseApi';
import { requireDataArray } from '@/api/apiEnvelope';
import { parseBadge, type Badge } from '../model/badge';

/** Padanan `BadgeRepository` di frontend-android. */
export const badgeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBadges: build.query<Badge[], void>({
      query: () => ({ url: '/badges' }),
      transformResponse: (raw) => requireDataArray(raw).map(parseBadge),
      providesTags: ['Badges'],
    }),
  }),
});

export const { useGetBadgesQuery } = badgeApi;
