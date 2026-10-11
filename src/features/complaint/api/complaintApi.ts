import { baseApi } from '@/api/baseApi';
import { requireData, requireDataArray } from '@/api/apiEnvelope';
import {
  parseComplaintAgency,
  parseComplaintAgencyDetail,
  parseComplaintCategory,
  type ComplaintAgency,
  type ComplaintAgencyDetail,
  type ComplaintCategory,
} from '../model/complaintAgency';

export const complaintApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getComplaintAgencies: build.query<ComplaintAgency[], void>({
      query: () => ({ url: '/complaint-agencies' }),
      transformResponse: (raw) => requireDataArray(raw).map(parseComplaintAgency),
    }),

    getComplaintAgencyDetail: build.query<ComplaintAgencyDetail, string>({
      query: (slug) => ({ url: `/complaint-agencies/${encodeURIComponent(slug)}` }),
      transformResponse: (raw) => parseComplaintAgencyDetail(requireData(raw)),
    }),

    getComplaintCategories: build.query<ComplaintCategory[], void>({
      query: () => ({ url: '/complaint-categories' }),
      transformResponse: (raw) => requireDataArray(raw).map(parseComplaintCategory),
    }),
  }),
});

export const {
  useGetComplaintAgenciesQuery,
  useGetComplaintAgencyDetailQuery,
  useGetComplaintCategoriesQuery,
} = complaintApi;
