import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { RoomDTO, RoomsDTO } from '../model/types';
import {
  CreateRoomRequestSchema,
  DeleteRoomRequestSchema,
  DeleteRoomResponseSchema,
  RoomDTOSchema,
  RoomsDTOSchema,
  UpdateRoomRequestSchema,
} from '../model/schema';

export type CreateRoomRequest = Omit<RoomDTO, 'id'> & { type: BusinessType };
export type UpdateRoomRequest = RoomDTO & { type: BusinessType };

export const roomsApi = createApi({
  reducerPath: 'roomsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Room'],
  endpoints: (build) => ({
    getRooms: build.query<RoomsDTO, BusinessType>({
      query: (type) => `/rooms?type=${type}`,
      transformResponse: validateResponse(RoomsDTOSchema),
      providesTags: (result) =>
        result
          ? [...result.rooms.map((r) => ({ type: 'Room' as const, id: r.id })), { type: 'Room' as const, id: 'LIST' }]
          : [{ type: 'Room' as const, id: 'LIST' }],
    }),
    createRoom: build.mutation<RoomDTO, CreateRoomRequest>({
      query: (request) => {
        const { type, ...body } = validateRequest(CreateRoomRequestSchema, request);
        return { url: `/rooms?type=${type}`, method: 'POST', body };
      },
      transformResponse: validateResponse(RoomDTOSchema),
      invalidatesTags: [{ type: 'Room', id: 'LIST' }],
    }),
    updateRoom: build.mutation<RoomDTO, UpdateRoomRequest>({
      query: (request) => {
        const { type, id, ...body } = validateRequest(UpdateRoomRequestSchema, request);
        return { url: `/rooms/${id}?type=${type}`, method: 'PUT', body };
      },
      transformResponse: validateResponse(RoomDTOSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Room', id }, { type: 'Room', id: 'LIST' }],
    }),
    deleteRoom: build.mutation<{ id: string }, { id: string; type: BusinessType }>({
      query: (request) => {
        const { id, type } = validateRequest(DeleteRoomRequestSchema, request);
        return { url: `/rooms/${id}?type=${type}`, method: 'DELETE' };
      },
      transformResponse: validateResponse(DeleteRoomResponseSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Room', id }, { type: 'Room', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
