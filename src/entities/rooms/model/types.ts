export type RoomStatus = 'occupied' | 'free' | 'cleaning';

export interface RoomDTO {
  id: string;
  number: string;
  kind: string;
  status: RoomStatus;
  pet?: string;
  client?: string;
  checkout?: string;
}

export interface RoomsDTO {
  rooms: RoomDTO[];
}
