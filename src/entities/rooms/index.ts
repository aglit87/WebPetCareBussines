export {
  roomsApi,
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from './api/roomsApi';
export type { RoomsDTO, RoomDTO, RoomStatus } from './model/types';
export type { CreateRoomRequest, UpdateRoomRequest } from './api/roomsApi';
