export type RecordStatus = 'paid' | 'onsite' | 'later' | 'done' | 'cancelled';

export interface RecordDTO {
  id: string;
  date: string;
  time: string;
  pet: string;
  client: string;
  service: string;
  amount: string;
  status: RecordStatus;
  avatar: string;
}

export interface RecordsDTO {
  records: RecordDTO[];
}
