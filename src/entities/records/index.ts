export {
  recordsApi,
  useGetRecordsQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} from './api/recordsApi';
export type { RecordsDTO, RecordDTO, RecordStatus } from './model/types';
export type { CreateRecordRequest, UpdateRecordRequest } from './api/recordsApi';
