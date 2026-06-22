import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { DriverDTO, DriversDTO } from '../model/types';
import {
  CreateDriverRequestSchema,
  DeleteDriverRequestSchema,
  DeleteDriverResponseSchema,
  DriverDTOSchema,
  DriversDTOSchema,
  UpdateDriverRequestSchema,
} from '../model/schema';

export type CreateDriverRequest = Omit<DriverDTO, 'id'> & { type: BusinessType };
export type UpdateDriverRequest = DriverDTO & { type: BusinessType };

export const driversApi = createApi({
  reducerPath: 'driversApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Driver'],
  endpoints: (build) => ({
    getDrivers: build.query<DriversDTO, BusinessType>({
      query: (type) => `/drivers?type=${type}`,
      transformResponse: validateResponse(DriversDTOSchema),
      providesTags: (result) =>
        result
          ? [...result.drivers.map((d) => ({ type: 'Driver' as const, id: d.id })), { type: 'Driver' as const, id: 'LIST' }]
          : [{ type: 'Driver' as const, id: 'LIST' }],
    }),
    createDriver: build.mutation<DriverDTO, CreateDriverRequest>({
      query: (request) => {
        const { type, ...body } = validateRequest(CreateDriverRequestSchema, request);
        return { url: `/drivers?type=${type}`, method: 'POST', body };
      },
      transformResponse: validateResponse(DriverDTOSchema),
      invalidatesTags: [{ type: 'Driver', id: 'LIST' }],
    }),
    updateDriver: build.mutation<DriverDTO, UpdateDriverRequest>({
      query: (request) => {
        const { type, id, ...body } = validateRequest(UpdateDriverRequestSchema, request);
        return { url: `/drivers/${id}?type=${type}`, method: 'PUT', body };
      },
      transformResponse: validateResponse(DriverDTOSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Driver', id }, { type: 'Driver', id: 'LIST' }],
    }),
    deleteDriver: build.mutation<{ id: string }, { id: string; type: BusinessType }>({
      query: (request) => {
        const { id, type } = validateRequest(DeleteDriverRequestSchema, request);
        return { url: `/drivers/${id}?type=${type}`, method: 'DELETE' };
      },
      transformResponse: validateResponse(DeleteDriverResponseSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Driver', id }, { type: 'Driver', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driversApi;
