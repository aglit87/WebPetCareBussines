import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';

// BFF gateway: the only piece that knows the real backend URL. The browser
// bundle never sees it — it only ever talks to this process, same-origin.
// Scoped to /api/auth/* per the auth-gateway ask; other /api/* routes still
// go through the Vite dev proxy (see vite.config.ts) until they need the same treatment.
const BACKEND_URL = process.env.AUTH_BACKEND_URL ?? 'http://localhost:5000';
const PORT = Number(process.env.GATEWAY_PORT ?? 4000);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const app = express();

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
  }),
);

app.use(express.static(distDir));

// SPA fallback for client-side routing (Express 5 dropped bare '*' patterns).
app.use((_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Gateway listening on http://localhost:${PORT} (auth -> ${BACKEND_URL})`);
});
