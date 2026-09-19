# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

This is a Russian-language React 18 + Vite + TypeScript application for the PetCare business cabinet. The product adapts the cabinet to one of four business types: `vet`, `grooming`, `boarding`, or `taxi`.

The project follows a Feature-Sliced Design-style layout:

- `src/app/` — application bootstrap, Redux store, router, providers, and global styles.
- `src/pages/` — route-level screens: registration, login, password recovery, and the business cabinet.
- `src/widgets/` — reusable page sections and layout: sidebar, topbar, cabinet shell, domain widgets, and route guards.
- `src/features/` — small user interactions that do not belong to a domain entity: business-type selection and OTP confirmation.
- `src/entities/` — domain models and RTK Query APIs. Each domain has `api/`, `model/`, and an `index.ts` export.
- `src/mocks/` — MSW mock backend (peer layer, may depend on entities and shared): browser worker, endpoint/auth handlers, seed data, and request-body validation via zod.
- `src/shared/` — cross-cutting configuration, API utilities, helpers, and UI re-exports.

The TypeScript alias `@/*` points to `src/*` in `tsconfig.json`.

## Big-picture data flow

1. Registration chooses a `BusinessType`. The choice is persisted in `entities/business` and stored in `localStorage` by `src/app/store` under a versioned key (`petcare.v1.*`, see `shared/lib/storage.ts`).
2. `shared/config/businessTypes.ts` is the source of truth for business labels, navigation, themes, and default services. `useBusinessTheme()` maps the selected type to CSS custom properties used by cabinet SCSS modules.
3. `CabinetPage` reads the selected business config and maps navigation IDs to widgets. Unknown or unavailable sections render a placeholder instead of failing.
4. Domain widgets call RTK Query endpoints with the selected `BusinessType`.
5. All API endpoints use `reauthBaseQuery` from `entities/auth/api/reauthBaseQuery.ts`, built by the `createBaseQueryWithReauth` factory in `shared/api/createBaseQueryWithReauth.ts`. It attaches the bearer token and shares one in-flight refresh request when parallel calls receive `401`.
6. RTK Query responses are validated with Zod through `validateResponse()`. Request bodies are validated with `validateRequest()` before a network request is made.
7. CRUD endpoints use RTK Query tags so successful mutations invalidate their list queries.
8. Auth uses a two-token flow. The access token is held in Redux memory, while the user and refresh token are persisted in `localStorage` from `src/app/store` (versioned keys). `AuthBootstrap` performs a silent refresh on app load to avoid a flash of the login screen.
9. Persistence lives outside the reducers: `entities/auth` and `entities/business` slices are side-effect-free, and `src/app/store` hydrates them on boot and writes changes through a store subscription. On auth loss (logout or failed refresh) `src/app/store` resets all RTK Query caches.

## Auth and business setup

- `AuthBootstrap` waits for the initial auth status before rendering the router.
- `/` requires authentication; `/login` and `/forgot-password` are guest-only. `/register` is intentionally open so a new account can be created.
- Registration and login use email + password followed by a six-digit OTP. The OTP purpose is `register`, `login`, or `reset`.
- Password validation is shared through `entities/auth/model/password.ts`; the same rules are used by registration and password recovery forms.
- `BusinessTypeSchema` is shared by domain schemas and uses `satisfies z.ZodType<BusinessType>` to keep the schema and TypeScript enum aligned.
- The mock auth handlers log the generated OTP to the console because this is a local mock flow.

## API and validation conventions

- Query endpoints are usually in `entities/<domain>/api/<domain>Api.ts`.
- DTO types live in `entities/<domain>/model/types.ts`.
- Zod schemas live in `entities/<domain>/model/schema.ts`.
- `shared/lib/zod/apiValidation.ts` contains the request/response validation helpers; do not bypass them for new API endpoints.
- Mock request bodies are validated against the same zod request schemas as the client (`src/mocks/validate.ts`), so the mock backend behaves like a real contract instance.
- For CRUD domains, the `type` query parameter selects the business profile. The `type` field is validated but removed from the request body before sending.
- `RoomFormModal` has conditional payload behavior: occupied rooms require pet, client, and checkout, while other statuses must omit those fields. The schema in `entities/rooms/model/schema.ts` mirrors this behavior.
- Review replies have a 500-character server limit defined by `REVIEW_REPLY_MAX_LENGTH`.

## MSW and local data

The application uses MSW as its local API backend:

- `src/app/providers/enableMocking.ts` starts the browser worker.
- `src/mocks/browser.ts` creates the worker.
- `src/mocks/handlers.ts` contains the endpoint handlers.
- `src/mocks/authHandlers.ts` contains auth, OTP, token refresh, and logout handlers.
- `src/mocks/db.ts` and `authDb.ts` hold seed data and live mock state.
- Mock domain changes are persisted under `petcare.mock.*` keys in `localStorage`.

Mocks are enabled with `?mock=1` in the URL or `VITE_USE_MOCKS=1`; by default they turn on only in dev builds. Production builds do not start MSW (`src/main.tsx`).

The mock backend is not the production database. The current backend context is `petcare-server-new`, which has Business-domain and OTP-related APIs plus clients/dashboard/drivers/income/records/rooms/schedule; this frontend has not yet been migrated to a real database. Treat the MSW contracts as the current integration contract and compare them carefully before connecting production endpoints.

## UI and modal patterns

- `src/shared/ui/index.ts` re-exports the shared component package `petcare-storybook-ui`; the component implementations live outside this repository.
- `vite.config.ts` imports design tokens and mixins from that package through Sass `loadPaths` and `additionalData`.
- Form modals are owned by their domain widget. The widget keeps the currently editing entity in local state and passes it to the modal.
- Modal form widgets use `key={editing?.id ?? 'new'}` in their owning widget. This is intentional: it remounts the modal between create and edit modes so Redux Toolkit Form or local form state does not become stale.
- Save/delete handlers clear the local error, call `.unwrap()`, close the modal on success, and render a user-readable error through `getErrorMessage()`.
- `ReviewReplyModal` returns `null` while no review is selected and uses a stable `'none'` key in the parent widget.

## Storybook

Storybook is configured in `.storybook/`:

- `.storybook/main.ts` discovers MDX and `*.stories.*` files under `src`.
- `.storybook/preview.tsx` imports global styles, imports the shared UI package CSS, wraps stories in the Redux provider, and starts MSW before rendering.
- `.storybook/preview-head.html` loads the project fonts.
- `tsconfig.json` includes `.storybook`, which is required for Storybook imports to type-check.

The current tracked stories cover the client form modal and schedule widget. Do not move the shared UI implementation back into `src/shared/ui`; keep that path as the app-facing re-export layer unless the external package contract changes.

## Build and development commands

From the repository root:

```bash
npm install
```

Installs dependencies and runs the MSW postinstall step. If `public/mockServiceWorker.js` is missing:

```bash
npm run msw:init
```

Run the development server:

```bash
npm run dev
```

The Vite server opens `http://localhost:5173` by default.

Run the production build:

```bash
npm run build
```

This runs `tsc -b` first and then `vite build`. The TypeScript project uses `noEmit: true` in the main config and references `tsconfig.node.json` for the Vite config.

Preview a production build:

```bash
npm run preview
```

Run Storybook:

```bash
npm run storybook
```

Storybook runs on port `6006`.

Build a static Storybook bundle:

```bash
npm run build-storybook
```

## Testing and linting

Unit tests run with Vitest in the Node environment (no browser). Tests are colocated as `*.test.ts` next to the source they cover; integration-style tests that talk to MSW use `src/shared/api/testEnv.ts` (absolutizes relative URLs in Node) and request handlers with wildcard hosts (`'*/api/...'`).

```bash
npm run test       # single run
npm run test:watch # watch mode
npm run lint       # ESLint (flat config)
```

CI (`.github/workflows/ci.yml`) runs lint, then `npm run build` (typecheck + vite), then tests.

## Non-obvious repository gotchas

- The main TypeScript config has `noEmit: true`, but the build still uses `tsc -b` because of the project reference to `tsconfig.node.json`.
- The Sass configuration uses the modern Sass API and imports `petcare-storybook-ui` variables and mixins from `node_modules`; changing either the API mode or the load paths can break shared styling.
- The app imports `petcare-storybook-ui/style.css` directly in `main.tsx` and `src/shared/ui/index.ts`; keep that dependency available when changing UI extraction.
- `dist/`, `dist-ssr/`, `storybook-static/`, `*.local`, and `*.tsbuildinfo` are ignored.
- No Cursor rules, Copilot rules, or existing `CLAUDE.md` were present when this file was created.
