import { fetchBaseQuery, type BaseQueryApi, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface ReauthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ReauthDeps {
  /** Базовый URL API. По умолчанию '/api'. */
  baseUrl?: string;
  /** URL эндпоинта обновления токенов (например '/auth/refresh'). */
  refreshUrl: string;
  getAccessToken: (state: unknown) => string | null;
  getRefreshToken: (state: unknown) => string | null;
  onTokensRefreshed: (tokens: ReauthTokens, api: BaseQueryApi) => void;
  onAuthFailed: (api: BaseQueryApi) => void;
}

// Фабрика не знает ни про домены, ни про приложение — только про RTK Query.
// Токены и действия инжектятся колбэками, поэтому слой shared остаётся
// переиспользуемым и не зависит вверх по FSD.
export const createBaseQueryWithReauth = (
  deps: ReauthDeps,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const { baseUrl = '/api', refreshUrl, getAccessToken, getRefreshToken, onTokensRefreshed, onAuthFailed } = deps;

  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getAccessToken(getState());
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  });

  // Module-level so concurrent 401s triggered by parallel queries share one
  // in-flight refresh instead of each kicking off (and racing) their own.
  let refreshPromise: Promise<ReauthTokens | null> | null = null;

  return async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      if (!refreshPromise) {
        const refreshToken = getRefreshToken(api.getState());
        refreshPromise = refreshToken
          ? Promise.resolve(
              rawBaseQuery({ url: refreshUrl, method: 'POST', body: { refreshToken } }, api, extraOptions),
            )
              .then((r) => (r.data as ReauthTokens | undefined) ?? null)
              .finally(() => {
                refreshPromise = null;
              })
          : Promise.resolve(null);
      }

      const refreshed = await refreshPromise;
      if (refreshed) {
        onTokensRefreshed(refreshed, api);
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        onAuthFailed(api);
      }
    }

    return result;
  };
};