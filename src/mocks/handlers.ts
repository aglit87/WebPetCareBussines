import { http, HttpResponse, delay } from 'msw';
import { z } from 'zod';
import type { BusinessType } from '@/shared/config/businessTypes';
import { validateBody } from './validate';
import {
  dashboardDb,
  recordsDb, setRecordsDb,
  clientsDb, setClientsDb,
  generateDaySchedule, generateMonthSchedule,
  servicesDb, setServicesDb,
  incomeDb,
  reviewsDb, setReviewsDb,
  roomsDb, setRoomsDb,
  driversDb, setDriversDb,
} from './db';
import { getUserFromRequest } from './authDb';
import { authHandlers } from './authHandlers';
import { CreateClientRequestSchema, UpdateClientRequestSchema } from '@/entities/clients/model/schema';
import { CreateDriverRequestSchema, UpdateDriverRequestSchema } from '@/entities/drivers/model/schema';
import { CreateRecordRequestSchema, UpdateRecordRequestSchema } from '@/entities/records/model/schema';
import { UpdateReviewReplyRequestSchema } from '@/entities/reviews/model/schema';
import { CreateRoomRequestSchema, UpdateRoomRequestSchema } from '@/entities/rooms/model/schema';
import { CreateServiceRequestSchema, UpdateServiceRequestSchema } from '@/entities/services/model/schema';

// Клиент отделяет `type` в query-параметр — склеиваем обратно для валидации по контракту.
const withType = (body: unknown, type: BusinessType): unknown => ({ ...(body as object), type });

// 401s here are what give `reauthBaseQuery`
// (entities/auth/api/reauthBaseQuery.ts) something real to react to —
// without this gate the access-token refresh path would never actually be
// exercised against the mock backend.
const requireAuth = (request: Request): HttpResponse<{ message: string }> | null => {
  return getUserFromRequest(request) ? null : HttpResponse.json({ message: 'Не авторизован' }, { status: 401 });
};

// `getDb` is a thunk (not a snapshot value) so every request re-reads the
// live `let *Db` binding in db.ts — required because mutations reassign
// that binding wholesale (see setXDb in db.ts), and a value captured once
// at handler-construction time would otherwise go stale after the first write.
const mockEndpoint = <T extends Record<string, any>>(path: string, getDb: () => Record<BusinessType, T>) => {
  return http.get(`*/api/${path}`, async ({ request }) => {
    const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
    if (authError) return authError;
    await delay(400); // surface the loading (skeleton) state
    const url: URL = new URL(request.url);
    const type: BusinessType = (url.searchParams.get('type') as BusinessType) ?? 'vet';
    const db: Record<BusinessType, T> = getDb();
    return HttpResponse.json(db[type] ?? db.vet);
  });
};

const typeFromUrl = (request: Request): BusinessType => {
  return (new URL(request.url).searchParams.get('type') as BusinessType) ?? 'vet';
};

// Generic CRUD for the entities sharing the `{ [pluralKey]: Item[] }` shape
// (Services, Records, Clients, Rooms, Drivers) — Reviews gets bespoke handlers
// below since its update semantics (reply-only, no create) genuinely differ.
const mockCrud = <Item extends { id: string }, Key extends string>(
  path: string,
  itemsKey: Key,
  getDb: () => Record<BusinessType, Record<Key, Item[]>>,
  setDb: (next: Record<BusinessType, Record<Key, Item[]>>) => void,
  schemas: { create: z.ZodTypeAny; update: z.ZodTypeAny },
) => {
  return [
    http.post(`*/api/${path}`, async ({ request }) => {
      const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
      if (authError) return authError;
      await delay(300);
      const type: BusinessType = typeFromUrl(request);
      const db: Record<BusinessType, Record<Key, Item[]>> = getDb();
      const rawBody: unknown = await request.json();
      // Клиент отделяет `type` в query-параметр — склеиваем обратно для валидации по контракту.
      const check: { ok: boolean; message?: string } = validateBody(schemas.create, withType(rawBody, type));
      if (!check.ok) return HttpResponse.json({ message: check.message }, { status: 400 });
      const body: Omit<Item, 'id'> = rawBody as Omit<Item, 'id'>;
      const item: Item = { ...body, id: crypto.randomUUID() } as Item;
      const next: Record<BusinessType, Record<Key, Item[]>> = { ...db, [type]: { ...db[type], [itemsKey]: [...db[type][itemsKey], item] } };
      setDb(next);
      return HttpResponse.json(item, { status: 201 });
    }),
    http.put(`*/api/${path}/:id`, async ({ request, params }) => {
      const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
      if (authError) return authError;
      await delay(300);
      const type: BusinessType = typeFromUrl(request);
      const db: Record<BusinessType, Record<Key, Item[]>> = getDb();
      const rawBody: unknown = await request.json();
      const check: { ok: boolean; message?: string } = validateBody(schemas.update, withType({ ...(rawBody as object), id: params.id }, type));
      if (!check.ok) return HttpResponse.json({ message: check.message }, { status: 400 });
      const body: Item = rawBody as Item;
      const list: Item[] = db[type][itemsKey].map((it) => (it.id === params.id ? { ...it, ...body, id: it.id } : it));
      const next: Record<BusinessType, Record<Key, Item[]>> = { ...db, [type]: { ...db[type], [itemsKey]: list } };
      setDb(next);
      return HttpResponse.json(list.find((it) => it.id === params.id));
    }),
    http.delete(`*/api/${path}/:id`, async ({ request, params }) => {
      const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
      if (authError) return authError;
      await delay(300);
      const type: BusinessType = typeFromUrl(request);
      const db: Record<BusinessType, Record<Key, Item[]>> = getDb();
      const list: Item[] = db[type][itemsKey].filter((it) => it.id !== params.id);
      const next: Record<BusinessType, Record<Key, Item[]>> = { ...db, [type]: { ...db[type], [itemsKey]: list } };
      setDb(next);
      return HttpResponse.json({ id: params.id });
    }),
  ];
};

export const handlers = [
  mockEndpoint('dashboard', () => dashboardDb),
  mockEndpoint('records', () => recordsDb),
  ...mockCrud('records', 'records', () => recordsDb, setRecordsDb, { create: CreateRecordRequestSchema, update: UpdateRecordRequestSchema }),
  mockEndpoint('clients', () => clientsDb),
  ...mockCrud('clients', 'clients', () => clientsDb, setClientsDb, { create: CreateClientRequestSchema, update: UpdateClientRequestSchema }),
  http.get('*/api/schedule', async ({ request }) => {
    const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
    if (authError) return authError;
    await delay(400);
    const url: URL = new URL(request.url);
    const type: BusinessType = (url.searchParams.get('type') as BusinessType) ?? 'vet';
    const date: string = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
    return HttpResponse.json(generateDaySchedule(type, date));
  }),
  http.get('*/api/schedule/month', async ({ request }) => {
    const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
    if (authError) return authError;
    await delay(400);
    const url: URL = new URL(request.url);
    const type: BusinessType = (url.searchParams.get('type') as BusinessType) ?? 'vet';
    const month: string = url.searchParams.get('month') ?? new Date().toISOString().slice(0, 7);
    return HttpResponse.json(generateMonthSchedule(type, month));
  }),
  mockEndpoint('services', () => servicesDb),
  ...mockCrud('services', 'services', () => servicesDb, setServicesDb, { create: CreateServiceRequestSchema, update: UpdateServiceRequestSchema }),
  mockEndpoint('income', () => incomeDb),
  mockEndpoint('reviews', () => reviewsDb),
  http.put('*/api/reviews/:id/reply', async ({ request, params }) => {
    const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
    if (authError) return authError;
    await delay(300);
    const type: BusinessType = typeFromUrl(request);
    const { reply }: { reply: string } = (await request.json()) as { reply: string };
    const check: { ok: boolean; message?: string } = validateBody(UpdateReviewReplyRequestSchema, { id: params.id, type, reply });
    if (!check.ok) return HttpResponse.json({ message: check.message }, { status: 400 });
    const list = reviewsDb[type].reviews.map((r) => (r.id === params.id ? { ...r, reply } : r));
    setReviewsDb({ ...reviewsDb, [type]: { ...reviewsDb[type], reviews: list } });
    return HttpResponse.json(list.find((r) => r.id === params.id));
  }),
  http.delete('*/api/reviews/:id', async ({ request, params }) => {
    const authError: HttpResponse<{ message: string }> | null = requireAuth(request);
    if (authError) return authError;
    await delay(300);
    const type: BusinessType = typeFromUrl(request);
    const list = reviewsDb[type].reviews.filter((r) => r.id !== params.id);
    setReviewsDb({ ...reviewsDb, [type]: { ...reviewsDb[type], reviews: list } });
    return HttpResponse.json({ id: params.id });
  }),
  mockEndpoint('rooms', () => roomsDb),
  ...mockCrud('rooms', 'rooms', () => roomsDb, setRoomsDb, { create: CreateRoomRequestSchema, update: UpdateRoomRequestSchema }),
  mockEndpoint('drivers', () => driversDb),
  ...mockCrud('drivers', 'drivers', () => driversDb, setDriversDb, { create: CreateDriverRequestSchema, update: UpdateDriverRequestSchema }),
  ...authHandlers,
];
