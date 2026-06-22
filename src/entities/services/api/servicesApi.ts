import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { ServiceDTO, ServicesDTO } from '../model/types';
import {
  CreateServiceRequestSchema,
  DeleteServiceRequestSchema,
  DeleteServiceResponseSchema,
  ServiceDTOSchema,
  ServicesDTOSchema,
  UpdateServiceRequestSchema,
} from '../model/schema';

export type CreateServiceRequest = Omit<ServiceDTO, 'id'> & { type: BusinessType };
export type UpdateServiceRequest = ServiceDTO & { type: BusinessType };

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Service'],
  endpoints: (build) => ({
    getServices: build.query<ServicesDTO, BusinessType>({
      query: (type) => `/services?type=${type}`,
      transformResponse: validateResponse(ServicesDTOSchema),
      providesTags: (result) =>
        result
          ? [...result.services.map((s) => ({ type: 'Service' as const, id: s.id })), { type: 'Service' as const, id: 'LIST' }]
          : [{ type: 'Service' as const, id: 'LIST' }],
    }),
    createService: build.mutation<ServiceDTO, CreateServiceRequest>({
      query: (request) => {
        const { type, ...body } = validateRequest(CreateServiceRequestSchema, request);
        return { url: `/services?type=${type}`, method: 'POST', body };
      },
      transformResponse: validateResponse(ServiceDTOSchema),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    updateService: build.mutation<ServiceDTO, UpdateServiceRequest>({
      query: (request) => {
        const { type, id, ...body } = validateRequest(UpdateServiceRequestSchema, request);
        return { url: `/services/${id}?type=${type}`, method: 'PUT', body };
      },
      transformResponse: validateResponse(ServiceDTOSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
    }),
    deleteService: build.mutation<{ id: string }, { id: string; type: BusinessType }>({
      query: (request) => {
        const { id, type } = validateRequest(DeleteServiceRequestSchema, request);
        return { url: `/services/${id}?type=${type}`, method: 'DELETE' };
      },
      transformResponse: validateResponse(DeleteServiceResponseSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
