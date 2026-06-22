import { configureStore } from '@reduxjs/toolkit';
import { businessReducer } from '@/entities/business';
import { authReducer, authApi } from '@/entities/auth';
import { dashboardApi } from '@/entities/dashboard';
import { recordsApi } from '@/entities/records';
import { clientsApi } from '@/entities/clients';
import { scheduleApi } from '@/entities/schedule';
import { servicesApi } from '@/entities/services';
import { incomeApi } from '@/entities/income';
import { reviewsApi } from '@/entities/reviews';
import { roomsApi } from '@/entities/rooms';
import { driversApi } from '@/entities/drivers';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [recordsApi.reducerPath]: recordsApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [incomeApi.reducerPath]: incomeApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [driversApi.reducerPath]: driversApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      dashboardApi.middleware,
      recordsApi.middleware,
      clientsApi.middleware,
      scheduleApi.middleware,
      servicesApi.middleware,
      incomeApi.middleware,
      reviewsApi.middleware,
      roomsApi.middleware,
      driversApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
