import { baseApi } from '@/api/baseApi';
import { requireData, requireDataArray } from '@/api/apiEnvelope';
import { parseSector, type Sector } from '../model/sector';
import { parseSectorDetail, type SectorDetail } from '../model/sectorDetail';
import { parseJourneyDetail, type JourneyDetail } from '../model/journeyDetail';

/** Padanan `LearningRepository` di frontend-android. */
export const learningApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSectors: build.query<Sector[], void>({
      query: () => ({ url: '/sectors' }),
      transformResponse: (raw) => requireDataArray(raw).map(parseSector),
      providesTags: ['Sectors'],
    }),

    getSectorDetail: build.query<SectorDetail, string>({
      query: (slug) => ({ url: `/sectors/${slug}` }),
      transformResponse: (raw) => parseSectorDetail(requireData(raw)),
      providesTags: (_result, _error, slug) => [{ type: 'SectorDetail', id: slug }],
    }),

    getJourneyDetail: build.query<JourneyDetail, string>({
      query: (journeyId) => ({ url: `/journeys/${journeyId}` }),
      transformResponse: (raw) => parseJourneyDetail(requireData(raw)),
      providesTags: (_result, _error, journeyId) => [{ type: 'JourneyDetail', id: journeyId }],
    }),

    completePretestSurvey: build.mutation<void, string>({
      query: (slug) => ({
        url: `/sectors/${slug}/pretest-survey/complete`,
        method: 'POST',
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, slug) => [
        { type: 'SectorDetail', id: slug },
        'JourneyDetail',
      ],
    }),

    completePosttestSurvey: build.mutation<void, string>({
      query: (slug) => ({
        url: `/sectors/${slug}/posttest-survey/complete`,
        method: 'POST',
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, slug) => [{ type: 'SectorDetail', id: slug }],
    }),
  }),
});

export const {
  useGetSectorsQuery,
  useGetSectorDetailQuery,
  useGetJourneyDetailQuery,
  useCompletePretestSurveyMutation,
  useCompletePosttestSurveyMutation,
} = learningApi;
