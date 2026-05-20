# GitHub Copilot Instructions

Guidance for GitHub Copilot when suggesting code in this repository.

## Project

Airah Diamonds — an e-commerce site for diamond jewellery with a ring customizer. Single repo, two tiers:

- **Frontend** (`src/`): React 18 + Vite + Redux Toolkit (persisted) + Tailwind.
- **Backend** (`backend/`): Express 4 (ESM) + Drizzle ORM (Postgres) + Upstash Redis sessions + Razorpay.

The top-level `README.md` is a stale Create React App template — **ignore it**. This project uses Vite, not CRA. There is no `npm test` and no linter.

## Commands

From repo root:

- `npm start` — Vite dev server on port **3006**.
- `npm run server` — backend on port **4001** (nodemon, `NODE_ENV=development`).
- `npm run db` — Drizzle Studio.
- `npm run dev` — runs frontend + backend + studio concurrently.
- `npm run build` — production build to `build/`.

From `backend/`:

- `npm run db:generate:dev` → generate migration into `drizzle/migrations/`.
- `npm run db:migrate:dev` → apply migrations.
- `npm run db:studio:dev` → studio.

Local Postgres: `docker-compose up -d` (postgres:17, host port **5433**, db `airnah`). Env files: `.env.development`, `.env.production`. Frontend vars must be prefixed `VITE_`.

## Architecture

### Sessions and identity

- Custom session system in `backend/session.js`: random 512-byte hex IDs stored in Upstash Redis under `session:<id>`, sent as an `httpOnly` cookie named `session-id` (7-day TTL). The `@clerk/*` deps are not used for end-user auth.
- Three middlewares in `backend/middleware/auth.js`:
  - `requireSession` — 401 on missing/expired, sets `req.user = { user_id, role }`.
  - `optionalSession` — attaches `req.user` if available; never rejects. Use for endpoints that support both users and guests.
  - `requireAdmin` — same as `requireSession` plus `role === 'admin'`.
- Frontend uses one shared axios instance (`src/utils/api.js`) with `withCredentials: true`. On 401 it fires a `window` `auth:unauthorized` event that `Header.jsx` listens to — do not import the Redux store from inside `api.js`.
- Guest vs authenticated identity: cart/favorites/orders support both. Use `resolveIdentity(req, source)` from `backend/utils/identity.js` — **authenticated `req.user.user_id` always wins**; otherwise fall back to a client-generated `guest_id`/`guestId` (UUID). New endpoints in this area must accept both. Never trust `req.query`/`req.body` identity when a session exists.
- Naming convention: route handlers and request/response payloads use camelCase (`userId`, `guestId`); the Drizzle feature layer and DB columns use snake_case (`user_id`, `guest_id`). `resolveIdentity` is the seam — it reads either spelling off the request and returns `{ user_id, guest_id }` for the feature layer. `clerk_user_id` has been removed everywhere; do not reintroduce it.
- Google OAuth is hand-rolled in `backend/routes/auth.js` (`/api/auth/google/callback`); do not introduce Clerk or NextAuth.

### Database (Drizzle)

- Schema lives in `backend/drizzle/schema/*.js`, re-exported through `backend/drizzle/schema.js` (this is what `drizzle.config.js` consumes). Add a new table file under `schema/` and re-export it.
- Data-access functions live in `backend/drizzle/features/*.js`. **Routes call feature functions — never put raw `db.select()` calls in routes.**
- Shared feature helpers live in `backend/drizzle/featureHelpers.js`. Reuse `ringStyleTotalPriceSQL(ringStylesTable)` for ring-style price sums and `favoritesJoinForUser(...)` for favorites markers instead of rewriting those SQL fragments.
- Reuse shared column builders from `schemaHelpers.js`: `created_at`, `updated_at`, `description`, `image_URL`, `SKU`.
- Favorites primary key spelling is `favorite_id` (American). Do not reintroduce `favourite_id` in new code or migrations.
- Money columns in `products` are split per diamond shape (`round_price`, `round_total`, …). This is intentional; do not "normalize" it.
- **Checkout integrity**: `loadCartForCheckout` in `features/orders.js` recomputes line totals from the catalog (joins on `products` / `diamonds` / `ring_styles`). Never trust a price from the client request body.
- DB schema workflow: edit `backend/drizzle/schema/<table>.js` → `npm run db:generate:dev` → review generated SQL → `npm run db:migrate:dev`. Don't hand-edit migration SQL.

### Express routes

All routers are mounted in `backend/server.js` without an `/api` prefix — each router declares full `/api/...` paths internally. (Some auth routes also accept un-prefixed variants for back-compat; see `signupPaths` in `routes/auth.js`.) Routes are mounted in this order: `auth`, `users`, `products`, `orders`, `admin`, `addresses`.

Pattern for a new endpoint:

```js
router.post("/api/foo", authLimiter, validate(fooSchema), async (req, res) => {
  // req.body is the parsed Zod value
});
```

- `validate(schema, source = 'body')` (`middleware/validate.js`) runs `schema.parse(req[source])` and replaces `req[source]` with the parsed value. On a `ZodError` it returns 400 with the first issue. Use `'query'` as the second arg for query-string validation.
- Zod schemas live in `backend/schemas.js`. Reuse `idOrNull`, `guestIdOrNull`, `ringSizeOrNull` for consistent coercion across cart/favorites/orders.
- Wrap async route handlers with `asyncHandler` from `backend/middleware/asyncHandler.js` and keep `errorHandler` mounted last in `server.js`.
- All admin mutations must use `validate(schema)` and an appropriate limiter where sensitive (`authLimiter` for login). Do not add unvalidated admin write endpoints.
- Rate limiters in `middleware/rateLimit.js`: `authLimiter` (10/15min), `paymentLimiter` (30/10min), `writeLimiter` (60/min). Apply per endpoint sensitivity. The app sets `trust proxy: 1`, so limiters key off the real client IP behind ngrok/proxies.

### Production CORS allowlist

Hard-coded in `backend/server.js` to the `airahdiamonds.com` family. Add new origins there directly — do not move them to env vars.

### Frontend state (Redux)

Single store in `src/store.js`, persisted to localStorage with `redux-persist` (key `root`). Slices in `src/redux/`:

- `ringCustomization` — drives the 3-step `/customize` flow. Holds chosen `diamond` + `ring` (head/shank style+metal) + computed total in `productDetails[0]`.
- `localization` — `country`, `currency` symbol, FX rates for USD/GBP/EUR/AUD/OMR/AED. Default is INR. **Rendered UI prices should use `<PriceDisplay value={...} />`**; keep `convertPrice` for non-render math only.
- `favoritesCart` — favorites + cart, hydrated from server for logged-in users, local for guests. Use `useFavoritesSync()` for list/grid components that need the local-to-server favorites merge + fetch cycle.
- `userProducts`, `orders` — list caches for admin/user views.

### Customize Ring flow

`src/components/CustomizeRing/StepOne|StepTwo|StepThree.jsx`:

1. Pick a loose diamond (`diamondsTable`).
2. Pick a ring style — head style/metal + shank style/metal — resolved via `getCustomStyle` (`routes/products.js`, keyed by the 4-tuple).
3. Review combined price and add to cart.

Total = diamond price + `head_style_price + shank_style_price + head_metal_price + shank_metal_price` from `ringStylesTable`. Use `calculateRingTotal(ring, diamond?)` on the frontend and `ringStyleTotalPriceSQL(ringStylesTable)` in Drizzle queries.

### Admin

Screens under `src/screens/Admin/` are mounted as top-level routes in `App.jsx` (`/dashboard`, `/addProducts`, `/productsList`, `/userList`, `/master`, `/addDiamonds`, `/addStyles`, `/diamondsList`, `/stylesList`, `/addCoupon`). **There is no client-side route guard** — admin gating is enforced server-side via `requireAdmin` on the corresponding API endpoints. When adding admin functionality, protect the API route, not the React route.

## Coding conventions

- Backend is ESM (`"type": "module"`). Import paths include the `.js` extension: `import { db } from '../db.js'`.
- `src/**/*.js` files are transformed as JSX by Vite (`vite.config.js`), so JSX is legal in `.js` files. Prefer `.jsx` for new files.
- Indentation is inconsistent across files (some tabs, some 4-space). **Match the existing file** rather than reformatting.
- Use Tailwind for new UI. Material Tailwind and MUI are both present — use whichever the surrounding file already uses; don't mix them in one component.
- API calls go through the shared axios instance in `src/utils/api.js`. Don't create new axios instances or use `fetch` directly for backend calls — you'll lose the session cookie and the 401 handler.
- Currency: never render a raw price. Use `<PriceDisplay value={price} />` for JSX output; call `convertPrice(Number(price), country, rates)` only for calculations that are not directly rendered.
- Filters: use `src/components/Filters.jsx`; pass `variant="card"` when a bordered card-style filter panel is needed. Do not recreate `Filters2`.
- Guest IDs are UUIDs generated client-side with the `uuid` package; persisted via Redux.

## Things to avoid

- Don't add a `/api` prefix in `server.js` mounts — the prefix lives inside each router file.
- Don't call `db.select(...)` from a route handler — write a feature helper.
- Don't trust prices, totals, or coupon discounts from the request body — recompute server-side.
- Don't introduce a new auth provider (Clerk for end users, NextAuth, Auth0). The Redis session model is the source of truth.
- Don't add `npm test` / `npm run lint` / Jest / Vitest / ESLint config without being asked — none are wired up today.
- Don't hand-edit files in `backend/drizzle/migrations/`. Regenerate.
- Don't commit live Razorpay / Google / Upstash credentials. `.env.development` ships with test keys only.
- Don't read user identity from `req.query` or `req.body` for authorization decisions — always go through `req.user` (session) via `resolveIdentity`. Client-supplied IDs are only acceptable as the **guest** fallback.
