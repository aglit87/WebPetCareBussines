import { createBrowserRouter } from 'react-router-dom';
import { RegistrationPage } from '@/pages/registration';
import { CabinetPage } from '@/pages/cabinet';
import { LoginPage } from '@/pages/login';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { RequireAuth, RequireGuest } from '@/widgets/route-guards';

export const router = createBrowserRouter([
  { path: '/', element: <RequireAuth><CabinetPage /></RequireAuth> },
  // No guard here: an anonymous visitor needs this page to create an account
  // in the first place (Step 0). Already-authenticated-but-no-business users
  // land here too (via CabinetPage's redirect) and skip straight to Step 1.
  { path: '/register', element: <RegistrationPage /> },
  { path: '/login', element: <RequireGuest><LoginPage /></RequireGuest> },
  { path: '/forgot-password', element: <RequireGuest><ForgotPasswordPage /></RequireGuest> },
]);
