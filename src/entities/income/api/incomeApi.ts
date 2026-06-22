import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { IncomeDTO } from '../model/types';
import { IncomeDTOSchema } from '../model/schema';

export const incomeApi = createApi({
  reducerPath: 'incomeApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getIncome: build.query<IncomeDTO, BusinessType>({
      query: (type) => `/income?type=${type}`,
      transformResponse: validateResponse(IncomeDTOSchema),
    }),
  }),
});

export const { useGetIncomeQuery } = incomeApi;
