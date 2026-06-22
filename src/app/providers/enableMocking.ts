// Starts MSW only in the browser, unless explicitly disabled via VITE_USE_MSW=false
// (e.g. to exercise the real backend through the dev proxy). Defaults to on so the
// existing mock-driven dev experience keeps working without any .env setup.
export async function enableMocking() {
  if (import.meta.env.VITE_USE_MSW === 'false') return;
  const { worker } = await import('@/shared/api/mock/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
