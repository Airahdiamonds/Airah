# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Airah Diamonds — an e-commerce site for diamond jewellery with a ring customizer. The repo holds both the Vite/React frontend (`src/`) and the Express/Drizzle backend (`backend/`) in a single workspace.

The README.md is a leftover Create React App template and is **not** accurate — this project is on Vite, not CRA, and `npm test` / `npm run eject` do not exist.

## Commands

Run from the repo root unless noted:

- `npm start` — frontend dev server on **port 3006** (Vite). Aliases: `npm run start:dev` (mode=development).
- `npm run server` — backend dev server (delegates to `backend/`'s `npm run start:dev`, nodemon + `NODE_ENV=development`). Backend listens on **port 4001**.
- `npm run db` — opens Drizzle Studio against the dev DB.
- `npm run dev` — runs all three (frontend + backend + drizzle studio) concurrently. Use this for normal local work.
- `npm run build` / `npm run preview` — production build to `build/` and preview.

Inside `backend/` (run directly when iterating on schema):

- `npm run db:generate:dev` — generate a migration from `drizzle/schema.js` into `drizzle/migrations/`.
- `npm run db:migrate:dev` — apply pending migrations.
- `npm run db:studio:dev` — Drizzle Studio.
- `node ./drizzle/seed.js` (alias `npm run seedWindows`) — seed data.

There is **no test runner and no linter** wired up. Don't fabricate `npm test` / `npm run lint` commands.

Local Postgres comes from `docker-compose.yml` (`postgres:17.0`, exposed on host port **5433**, db `airnah`, user `postgres`/`password`). Env files: `.env.development` and `.env.production` — `server.js` and `drizzle.config.js` pick one based on `NODE_ENV`. Vite-side vars must be prefixed `VITE_`.

## Architecture

### Two-tier monorepo, one DB

- **Frontend** (`src/`): React 18 + Vite, React Router, Redux Toolkit with `redux-persist` (localStorage), Tailwind + Material Tailwind + MUI (mixed — pick the one already used in the file you're editing). Vite config in `vite.config.js` includes a custom transform that treats `src/**/*.js` files as JSX, so `.js` and `.jsx` are interchangeable in `src/`.
- **Backend** (`backend/`): Express 4 (ESM, `"type": "module"`), Drizzle ORM over `postgres-js`, Upstash Redis for sessions, Razorpay for payments, nodemailer, Multer for uploads (served from `/uploads`). Routes are mounted **without an `/api` prefix** in `server.js` — each route file declares its own `/api/...` paths (some auth routes also accept un-prefixed variants for back-compat; see `signupPaths` in `routes/auth.js`).
- `ngrok` auto-connects in development only (`server.js:59`) to expose port 4000 — note this differs from the actual listen port (4001).

### Auth and sessions

Custom session system (not Clerk for end users, despite `@clerk/*` deps being present):

- `backend/session.js` — sessions are random 512-byte hex IDs stored in Upstash Redis under `session:<id>`, set as an `httpOnly` cookie named `session-id`. 7-day TTL.
- `backend/middleware/auth.js` — three middlewares:
  - `requireSession` — 401 if no/invalid session; sets `req.user = { user_id, role }`.
  - `optionalSession` — attaches `req.user` if available, never rejects. Use for endpoints that support both logged-in users and guests.
  - `requireAdmin` — same as `requireSession` plus `role === 'admin'`.
- Frontend uses one shared axios instance (`src/utils/api.js`) configured with `withCredentials: true`. On any 401 it dispatches a `window` event `auth:unauthorized` which `Header.jsx` listens for to clear the Redux user — there's no direct store import in `api.js` by design.
- Google OAuth is hand-rolled in `routes/auth.js` (`/api/auth/google/callback`) — exchanges code → fetches userinfo → calls `handleGoogleLogin` → creates a session cookie → redirects to `FRONTEND_URL` (or env-appropriate fallback).

### Guest vs authenticated identity

Cart/favorites/orders work for guests too. Use `resolveIdentity(req, source)` from `utils/identity.js`: **authenticated `req.user.user_id` always wins**; otherwise fall back to a `guest_id`/`guestId` (UUID generated client-side, stored in Redux/localStorage). When implementing a new endpoint that touches cart/favorites/orders, always accept both and prefer the session user. Never trust `req.query`/`req.body` identity when a session exists.

Naming convention: route handlers and request/response payloads use camelCase (`userId`, `guestId`); the Drizzle feature layer and DB columns use snake_case (`user_id`, `guest_id`). `resolveIdentity` is the seam — it accepts either spelling off the request and returns `{ user_id, guest_id }` for the feature layer to consume. `clerk_user_id` has been removed everywhere; don't reintroduce it.

### Database (Drizzle)

- Schema lives in `backend/drizzle/schema/*.js`, re-exported through `backend/drizzle/schema.js` which is what `drizzle.config.js` points at. Add new tables in a file under `schema/` and re-export from `schema.js`.
- Per-table data-access functions are in `backend/drizzle/features/*.js` (e.g. `features/orders.js`, `features/users.js`). Routes should call these helpers, not raw `db.select()` — keep SQL out of routes.
- Shared feature helpers live in `backend/drizzle/featureHelpers.js`. Reuse `ringStyleTotalPriceSQL(ringStylesTable)` for ring-style price sums and `favoritesJoinForUser(...)` for favorites markers.
- `schemaHelpers.js` exports shared column builders (`created_at`, `updated_at`, `description`, `image_URL`, `SKU`) — reuse them.
- Favorites primary key spelling is `favorite_id` (American). Do not reintroduce `favourite_id`.
- Money/prices in `products` are split across many columns per diamond shape (`round_quantity`, `round_price`, … `heart_total`) — this is intentional, not a normalization mistake.
- Checkout integrity: `loadCartForCheckout` in `features/orders.js` **always recomputes line totals from the catalog** (products/diamonds/ring_styles joins). Never trust a price from the client.

### Routes

All mounted in `server.js`: `auth`, `users`, `products`, `orders`, `admin`, `addresses`. Each file is a self-contained `express.Router` and declares full `/api/...` paths internally.

Validation/rate-limiting pattern (use this for new endpoints):

```js
router.post("/api/foo", authLimiter, validate(fooSchema), handler);
```

- `validate(schema, source='body')` (`middleware/validate.js`) runs `schema.parse(req[source])` (Zod), replaces `req[source]` with the parsed value, and returns a 400 with the first issue on failure.
- Zod schemas live in `backend/schemas.js`. Reuse helpers like `idOrNull`, `guestIdOrNull`, `ringSizeOrNull` for consistent coercion.
- Wrap async route handlers with `asyncHandler` from `middleware/asyncHandler.js`; keep the exported `errorHandler` mounted last in `server.js`.
- All admin mutations must use `validate(schema)` and an appropriate limiter where sensitive (`authLimiter` for login). Do not add unvalidated admin write endpoints.
- Rate limiters in `middleware/rateLimit.js`: `authLimiter` (10/15min), `paymentLimiter` (30/10min), `writeLimiter` (60/min). Apply by endpoint sensitivity. The app sets `trust proxy: 1` so these key off real client IP behind ngrok/proxy.

### Frontend state

Single Redux store (`src/store.js`), persisted to localStorage with `redux-persist` under key `root`. Slices in `src/redux/`:

- `ringCustomization` — drives the 3-step `/customize` flow (`StepOne/Two/Three` in `src/components/CustomizeRing/`). Holds chosen diamond + ring (head/shank style+metal) + computed total. Step state, `showDiamond`/`showRing` toggles, and full `productDetails[0]` shape lives here.
- `localization` — currency/country and FX rates (USD/GBP/EUR/AUD/OMR/AED). Default is INR (`₹`). Rendered prices should use `<PriceDisplay value={...} />`; keep `convertPrice` for non-render math only.
- `favoritesCart` — favorites + cart, hydrated from server for logged-in users and from local state for guests. Use `useFavoritesSync()` for grids/pages that need the local-to-server favorites merge + fetch cycle.
- `userProducts`, `orders` — admin/user product listing and order history caches.

### Admin

Admin screens live under `src/screens/Admin/` and are mounted at top-level routes in `App.jsx` (`/dashboard`, `/addProducts`, `/productsList`, `/userList`, `/master`, `/addDiamonds`, `/addStyles`, `/diamondsList`, `/stylesList`, `/addCoupon`). There is **no route guard** in `App.jsx` — admin gating is enforced server-side via `requireAdmin` on the corresponding API endpoints.

### Customize Ring flow

The headline feature. Three steps in `src/components/CustomizeRing/`:

1. **StepOne** — pick a loose diamond (`diamondsTable`).
2. **StepTwo** — pick a ring style — head style/metal + shank style/metal — which maps to a `ringStylesTable` row via `getCustomStyle` (`routes/products.js`, queried by the 4-tuple of head_style/head_metal/shank_style/shank_metal).
3. **StepThree** — review combined price and add to cart.

State is in `ringCustomizationSlice`; pricing combines `diamond.price` with the four `ringStylesTable` price columns (`head_style_price + shank_style_price + head_metal_price + shank_metal_price`). Use `calculateRingTotal(ring, diamond?)` on the frontend and `ringStyleTotalPriceSQL(ringStylesTable)` in Drizzle queries.

## Conventions worth knowing

- ESM everywhere on the backend (`"type": "module"`). Import paths include the `.js` extension.
- The frontend uses 4-space indentation in many files but tabs in others — match the file you're editing rather than imposing a single style.
- `src/**/*.js` files are transformed as JSX by the Vite config, so JSX is allowed in `.js` files. New files: prefer `.jsx` for clarity.
- Production CORS allowlist is hard-coded in `server.js` to the `airahdiamonds.com` domains — add new origins there, not via env.
- Filters: use `src/components/Filters.jsx`; pass `variant="card"` when a bordered card-style filter panel is needed. Do not recreate `Filters2`.
- Razorpay keys, Google OAuth, and Upstash Redis credentials are all in `.env.development` / `.env.production`. The committed `.env.development` contains **test keys** — treat live values as secret.
- When changing the DB schema: edit `backend/drizzle/schema/<table>.js` → `npm run db:generate:dev` (from `backend/`) → review generated SQL in `drizzle/migrations/` → `npm run db:migrate:dev`. Don't hand-edit migration SQL.
