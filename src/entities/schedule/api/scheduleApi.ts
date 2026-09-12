import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from '@/entities/auth';
import { validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { ScheduleDTO } from '../model/types';
import { ScheduleDTOSchema } from '../model/schema';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: reauthBaseQuery,
  endpoints: (build) => ({
    getSchedule: build.query<ScheduleDTO, BusinessType>({
      query: (type) => `/schedule?type=${type}`,
      transformResponse: validateResponse(ScheduleDTOSchema),
    }),
  }),
});

export const { useGetScheduleQuery } = scheduleApi;
