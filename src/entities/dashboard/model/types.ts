export type AppointmentStatus = 'paid' | 'onsite' | 'later';

export interface StatDTO {
  id: string;
  icon: string;
  iconColor: string;
  iconTint: string;
  value: string;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface AppointmentDTO {
  id: string;
  time: string;
  pet: string;
  client: string;
  service: string;
  amount: string;
  status: AppointmentStatus;
  avatar: string;
}

export interface RequestDTO {
  id: string;
  pet: string;
  client: string;
  when: string;
  amount: string;
  avatar: string;
}

export interface DashboardDTO {
  title: string;
  subtitle: string;
  stats: StatDTO[];
  today: AppointmentDTO[];
  requests: RequestDTO[];
}
