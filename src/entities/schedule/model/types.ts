export interface ScheduleSlotDTO {
  time: string;
  status: 'free' | 'busy';
  pet?: string;
  client?: string;
  service?: string;
}

export interface ScheduleDTO {
  date: string;
  slots: ScheduleSlotDTO[];
}
