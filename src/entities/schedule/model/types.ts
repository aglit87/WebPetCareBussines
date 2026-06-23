export interface ScheduleSlotDTO {
  time: string;
  status: 'free' | 'busy';
  pet?: string;
  client?: string;
  service?: string;
}

export interface ScheduleDTO {
  /** ISO-дата (yyyy-MM-dd), на которую отдано расписание. */
  date: string;
  slots: ScheduleSlotDTO[];
}

export interface ScheduleDayCountDTO {
  /** ISO-дата (yyyy-MM-dd). */
  date: string;
  busy: number;
  free: number;
}

export interface ScheduleMonthDTO {
  days: ScheduleDayCountDTO[];
}
