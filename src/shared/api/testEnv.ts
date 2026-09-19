export const TEST_BASE = 'http://localhost:3999';

// RTK fetchBaseQuery сам строит `new Request('/api/me')` (относительный URL),
// а undici такую ссылку не принимает. В тестах подменяем глобальный Request
// на класс, который абсолютизирует URL до ухода в сеть — MSW-хэндлеры при этом
// должны использовать полные URL (${TEST_BASE}/api/...).
export const installAbsoluteRequest = (base: string = TEST_BASE): void => {
  const OriginalRequest = globalThis.Request;
  globalThis.Request = new Proxy(OriginalRequest, {
    construct(target, args: [RequestInfo | URL, RequestInit?]) {
      const [input, init] = args;
      const url = input instanceof URL || typeof input === 'string' ? String(input) : input.url;
      const absolute = /^https?:\/\//.test(url) ? url : `${base}${url.startsWith('/') ? url : `/${url}`}`;
      return new target(absolute, init);
    },
  });
};