import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { ScheduleDTO, ScheduleMonthDTO } from '../model/types';
import { ScheduleDTOSchema, ScheduleMonthDTOSchema } from '../model/schema';

export interface GetScheduleArgs {
  type: BusinessType;
  /** ISO-дата (yyyy-MM-dd). */
  date: string;
}

export interface GetScheduleMonthArgs {
  type: BusinessType;
  /** ISO-месяц (yyyy-MM). */
  month: string;
}

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getSchedule: build.query<ScheduleDTO, GetScheduleArgs>({
      query: ({ type, date }) => `/schedule?type=${type}&date=${date}`,
      transformResponse: validateResponse(ScheduleDTOSchema),
    }),
    getScheduleMonth: build.query<ScheduleMonthDTO, GetScheduleMonthArgs>({
      query: ({ type, month }) => `/schedule/month?type=${type}&month=${month}`,
      transformResponse: validateResponse(ScheduleMonthDTOSchema),
    }),
  }),
});

export const { useGetScheduleQuery, useGetScheduleMonthQuery } = scheduleApi;
