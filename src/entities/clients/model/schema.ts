import { z } from 'zod';
import { BusinessTypeSchema } from '@/shared/config/businessTypes.schema';
import type { ClientDTO, ClientsDTO } from './types';

/**
 * Zod-схема одного клиента. Соответствует {@link ClientDTO}.
 */
export const ClientDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  phone: z.string(),
  pets: z.string(),
  visits: z.number(),
  lastVisit: z.string(),
  totalSpent: z.string(),
}) satisfies z.ZodType<ClientDTO>;

/**
 * Zod-схема ответа списка клиентов. Соответствует {@link ClientsDTO}.
 */
export const ClientsDTOSchema = z.object({
  clients: z.array(ClientDTOSchema),
}) satisfies z.ZodType<ClientsDTO>;

/**
 * Zod-схема тела запроса на создание клиента.
 * Соответствует `CreateClientRequest` из `api/clientsApi.ts`.
 */
export const CreateClientRequestSchema = ClientDTOSchema.omit({ id: true }).extend({
  type: BusinessTypeSchema,
});

/**
 * Zod-схема тела запроса на обновление клиента.
 * Соответствует `UpdateClientRequest` из `api/clientsApi.ts`.
 */
export const UpdateClientRequestSchema = ClientDTOSchema.extend({
  type: BusinessTypeSchema,
});

/**
 * Zod-схема тела запроса на удаление клиента.
 */
export const DeleteClientRequestSchema = z.object({
  id: z.string(),
  type: BusinessTypeSchema,
});

/**
 * Zod-схема ответа на удаление клиента.
 */
export const DeleteClientResponseSchema = z.object({ id: z.string() });
