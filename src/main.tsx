import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/app/router';
import { enableMocking } from '@/app/providers/enableMocking';
import { AuthBootstrap } from '@/app/providers/AuthBootstrap';
import '@/app/styles/global.scss';

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </Provider>
    </StrictMode>,
  );
});
