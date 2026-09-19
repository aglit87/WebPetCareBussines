import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from '@/entities/auth';
import { validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { DashboardDTO } from '../model/types';
import { DashboardDTOSchema } from '../model/schema';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: reauthBaseQuery,
  endpoints: (build) => ({
    getDashboard: build.query<DashboardDTO, BusinessType>({
      query: (type) => `/dashboard?type=${type}`,
      transformResponse: validateResponse(DashboardDTOSchema),
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
