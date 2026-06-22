// Starts MSW only in the browser. Returns once the worker is ready.
export async function enableMocking() {
  const { worker } = await import('@/shared/api/mock/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
