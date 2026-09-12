import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/app/router';
import { enableMocking } from '@/app/providers/enableMocking';
import { AuthBootstrap } from '@/app/providers/AuthBootstrap';
import '@/app/styles/global.scss';

// Моки включаются: по флагу в URL (?mock=1/?mock=0), иначе по VITE_USE_MOCKS,
// иначе по умолчанию только в dev-сборке. Продакшен-сборка MSW не стартует.
const mockParam: string | null = new URLSearchParams(window.location.search).get('mock');
const useMocks: boolean =
  mockParam === '1'
    ? true
    : mockParam === '0'
      ? false
      : import.meta.env.VITE_USE_MOCKS === '1' || (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS !== '0');

const renderApp = (): void => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </Provider>
    </StrictMode>,
  );
};

if (useMocks) enableMocking().then(renderApp);
else renderApp();
