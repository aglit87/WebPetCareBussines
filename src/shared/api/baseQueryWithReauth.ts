import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { loggedOut, tokensRefreshed } from '@/entities/auth/model/slice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// Module-level so concurrent 401s triggered by parallel queries share one
// in-flight refresh instead of each kicking off (and racing) their own.
let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!refreshPromise) {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;
      refreshPromise = refreshToken
        ? Promise.resolve(
            rawBaseQuery(
              { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
              api,
              extraOptions,
            ),
          )
            .then((r) => (r.data as { accessToken: string; refreshToken: string } | undefined) ?? null)
            .finally(() => {
              refreshPromise = null;
            })
        : Promise.resolve(null);
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      api.dispatch(tokensRefreshed(refreshed));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(loggedOut());
    }
  }

  return result;
};
