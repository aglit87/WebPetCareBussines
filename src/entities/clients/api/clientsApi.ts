import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { ClientDTO, ClientsDTO } from '../model/types';
import {
  ClientDTOSchema,
  ClientsDTOSchema,
  CreateClientRequestSchema,
  DeleteClientRequestSchema,
  DeleteClientResponseSchema,
  UpdateClientRequestSchema,
} from '../model/schema';

export type CreateClientRequest = Omit<ClientDTO, 'id'> & { type: BusinessType };
export type UpdateClientRequest = ClientDTO & { type: BusinessType };

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Client'],
  endpoints: (build) => ({
    getClients: build.query<ClientsDTO, BusinessType>({
      query: (type) => `/clients?type=${type}`,
      transformResponse: validateResponse(ClientsDTOSchema),
      providesTags: (result) =>
        result
          ? [...result.clients.map((c) => ({ type: 'Client' as const, id: c.id })), { type: 'Client' as const, id: 'LIST' }]
          : [{ type: 'Client' as const, id: 'LIST' }],
    }),
    createClient: build.mutation<ClientDTO, CreateClientRequest>({
      query: (request) => {
        const { type, ...body } = validateRequest(CreateClientRequestSchema, request);
        return { url: `/clients?type=${type}`, method: 'POST', body };
      },
      transformResponse: validateResponse(ClientDTOSchema),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: build.mutation<ClientDTO, UpdateClientRequest>({
      query: (request) => {
        const { type, id, ...body } = validateRequest(UpdateClientRequestSchema, request);
        return { url: `/clients/${id}?type=${type}`, method: 'PUT', body };
      },
      transformResponse: validateResponse(ClientDTOSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Client', id }, { type: 'Client', id: 'LIST' }],
    }),
    deleteClient: build.mutation<{ id: string }, { id: string; type: BusinessType }>({
      query: (request) => {
        const { id, type } = validateRequest(DeleteClientRequestSchema, request);
        return { url: `/clients/${id}?type=${type}`, method: 'DELETE' };
      },
      transformResponse: validateResponse(DeleteClientResponseSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Client', id }, { type: 'Client', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
