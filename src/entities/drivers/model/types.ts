export type DriverStatus = 'online' | 'busy' | 'offline';

export interface DriverDTO {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  status: DriverStatus;
  tripsToday: number;
  rating: number;
  x: number; // 0..100, position on the map widget
  y: number; // 0..100, position on the map widget
}

export interface DriversDTO {
  drivers: DriverDTO[];
}
