export {
  clientsApi,
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from './api/clientsApi';
export type { ClientsDTO, ClientDTO } from './model/types';
export type { CreateClientRequest, UpdateClientRequest } from './api/clientsApi';
