import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { loadStorage, saveStorage } from '@/shared/lib/storage';
import { businessReducer, businessInitialState } from '@/entities/business';
import { authReducer, authApi, authInitialState } from '@/entities/auth';
import { dashboardApi } from '@/entities/dashboard';
import { recordsApi } from '@/entities/records';
import { clientsApi } from '@/entities/clients';
import { scheduleApi } from '@/entities/schedule';
import { servicesApi } from '@/entities/services';
import { incomeApi } from '@/entities/income';
import { reviewsApi } from '@/entities/reviews';
import { roomsApi } from '@/entities/rooms';
import { driversApi } from '@/entities/drivers';
import type { AuthState } from '@/entities/auth';
import type { BusinessState } from '@/entities/business';

// Гидрируем слайсы из localStorage до создания стора. Ключи версионированы
// (shared/lib/storage), поэтому старые данные предыдущих версий не читаются.
interface StoredAuth {
  user: AuthState['user'];
  refreshToken: AuthState['refreshToken'];
}

const storedAuth: StoredAuth = loadStorage<StoredAuth>('auth', { user: null, refreshToken: null });
const authPreloaded: AuthState = {
  ...authInitialState,
  user: storedAuth.user,
  refreshToken: storedAuth.refreshToken,
  status: storedAuth.user && storedAuth.refreshToken ? 'idle' : 'unauthenticated',
};

const businessPreloaded: BusinessState = loadStorage<BusinessState>('business', businessInitialState);

const apiSlices = [
  authApi,
  dashboardApi,
  recordsApi,
  clientsApi,
  scheduleApi,
  servicesApi,
  incomeApi,
  reviewsApi,
  roomsApi,
  driversApi,
];

// Полный сброс кэшей RTK Query. Вызывается только при потере авторизации,
// чтобы данные одного пользователя не «протекали» следующему в том же браузере.
export const resetApiCaches = (): void => {
  apiSlices.forEach((api) => store.dispatch(api.util.resetApiState()));
};

// Logout или неуспешный refresh переводит статус auth в 'unauthenticated' —
// в этот момент стираем кэши всех API. Обычное обновление токенов
// (tokensRefreshed) статус не меняет и кэш не трогает.
// Проверяется на переходе, а не на состоянии: при старте приложения
// статус уже 'unauthenticated' — стирать нечего и не нужно.
const authCacheResetMiddleware: Middleware = (api) => (next) => (action) => {
  const before = api.getState().auth.status;
  const result = next(action);
  const after = api.getState().auth.status;
  if (before !== 'unauthenticated' && after === 'unauthenticated') {
    apiSlices.forEach((apiSlice) => api.dispatch(apiSlice.util.resetApiState()));
  }
  return result;
};

export const store = configureStore({
  preloadedState: {
    auth: authPreloaded,
    business: businessPreloaded,
  },
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
    getDefault().prepend(authCacheResetMiddleware).concat(
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

// Персист в localStorage выполняется здесь — вне редукторов (чистые слайсы).
// Подписка пишет состояние слайса при его изменении, как раньше это делал
// сам редуктор, но сайд-эффект отделён от домена.
let lastAuth: AuthState = store.getState().auth;
let lastBusiness: BusinessState = store.getState().business;
store.subscribe(() => {
  const { auth, business } = store.getState();
  if (auth !== lastAuth) {
    saveStorage('auth', { user: auth.user, refreshToken: auth.refreshToken });
    lastAuth = auth;
  }
  if (business !== lastBusiness) {
    saveStorage('business', business);
    lastBusiness = business;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
