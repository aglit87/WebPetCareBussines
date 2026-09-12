import { createBaseQueryWithReauth } from '@/shared/api/createBaseQueryWithReauth';
import { loggedOut, tokensRefreshed } from '../model/slice';

// Достаём токены из общего состояния без зависимости от app/store (FSD),
// через узкий интерфейс доступа к слайсу auth.
interface AuthStateAccess {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

// Единственный экземпляр reauth-запроса для всех доменных API.
// Провода (селекторы, действия) собраны здесь: entities/auth владеет
// и токенами, и реакцией на потерю сессии — shared об этом ничего не знает.
export const reauthBaseQuery = createBaseQueryWithReauth({
  baseUrl: '/api',
  refreshUrl: '/auth/refresh',
  getAccessToken: (state: unknown) => (state as AuthStateAccess).auth?.accessToken ?? null,
  getRefreshToken: (state: unknown) => (state as AuthStateAccess).auth?.refreshToken ?? null,
  onTokensRefreshed: (tokens, api) => {
    api.dispatch(tokensRefreshed(tokens));
  },
  onAuthFailed: (api) => {
    api.dispatch(loggedOut());
  },
});