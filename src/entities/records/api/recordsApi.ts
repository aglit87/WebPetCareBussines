import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from '@/entities/auth';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { RecordDTO, RecordsDTO } from '../model/types';
import {
  CreateRecordRequestSchema,
  DeleteRecordRequestSchema,
  DeleteRecordResponseSchema,
  RecordDTOSchema,
  RecordsDTOSchema,
  UpdateRecordRequestSchema,
} from '../model/schema';

export type CreateRecordRequest = Omit<RecordDTO, 'id'> & { type: BusinessType };
export type UpdateRecordRequest = RecordDTO & { type: BusinessType };

export const recordsApi = createApi({
  reducerPath: 'recordsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Record'],
  endpoints: (build) => ({
    getRecords: build.query<RecordsDTO, BusinessType>({
      query: (type) => `/records?type=${type}`,
      transformResponse: validateResponse(RecordsDTOSchema),
      providesTags: (result) =>
        result
          ? [...result.records.map((r) => ({ type: 'Record' as const, id: r.id })), { type: 'Record' as const, id: 'LIST' }]
          : [{ type: 'Record' as const, id: 'LIST' }],
    }),
    createRecord: build.mutation<RecordDTO, CreateRecordRequest>({
      query: (request) => {
        const { type, ...body } = validateRequest(CreateRecordRequestSchema, request);
        return { url: `/records?type=${type}`, method: 'POST', body };
      },
      transformResponse: validateResponse(RecordDTOSchema),
      invalidatesTags: [{ type: 'Record', id: 'LIST' }],
    }),
    updateRecord: build.mutation<RecordDTO, UpdateRecordRequest>({
      query: (request) => {
        const { type, id, ...body } = validateRequest(UpdateRecordRequestSchema, request);
        return { url: `/records/${id}?type=${type}`, method: 'PUT', body };
      },
      transformResponse: validateResponse(RecordDTOSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Record', id }, { type: 'Record', id: 'LIST' }],
    }),
    deleteRecord: build.mutation<{ id: string }, { id: string; type: BusinessType }>({
      query: (request) => {
        const { id, type } = validateRequest(DeleteRecordRequestSchema, request);
        return { url: `/records/${id}?type=${type}`, method: 'DELETE' };
      },
      transformResponse: validateResponse(DeleteRecordResponseSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Record', id }, { type: 'Record', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRecordsQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} = recordsApi;
