# Expense Tracker UI

> Part of [bakir004/expense-tracker](https://github.com/bakir004/expense-tracker) — a full-stack expense tracking suite.

Frontend for an expense-tracking app: dashboard, transactions, charts, categories, transaction groups, **profile / account settings**, and auth against a separate REST API.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix / Base UI), TanStack Query, React Router, React Hook Form + Zod, Recharts.

**Package manager:** the repo pins [pnpm](https://pnpm.io/) via `packageManager` in `package.json`. Typical workflow: `pnpm install`, `pnpm dev`, `pnpm build`.

---

## Quickstart

### Option A — Full stack with Docker

Runs PostgreSQL, the API, and this UI (nginx serves the SPA and proxies `/api` to the API so the browser stays on one origin). Images are pulled from Docker Hub — no local build required.

1. From **this directory** (`expense-tracker-ui`):

   ```bash
   docker compose up
   ```

2. Open **`http://localhost:8080`** for the app.
3. Optional: API directly at **`http://localhost:5000`**, Postgres on **`localhost:5432`** (see `docker-compose.yml` for credentials).

Images used:
- UI: `bakeroni1/expense-ui:latest`
- API: `bakeroni1/expense-api:latest`

Seeded test users (if the API seeds on first run) are documented in the API; common example logins use email + `Password123!` where the API README lists them.

### Option B — Local UI + API you run yourself

1. Start the **Expense Tracker API** and database so the API is reachable (default in code: **`http://localhost:5000/api`**).
2. Enable [Corepack](https://nodejs.org/api/corepack.html) if needed, then install and run the dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Open **`http://localhost:5173`** (Vite default).

Override the API base URL when building or in dev:

```bash
# examples
VITE_API_URL=http://localhost:5000/api VITE_API_VERSION=v1 pnpm dev
```

(`VITE_*` variables are baked in at **build** time for production builds; use a `.env` / `.env.local` file with the same names if you prefer.)

### Useful commands

| Command | Purpose |
|--------|---------|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Typecheck + production bundle to `dist/` |
| `pnpm preview` | Serve `dist/` locally (after `pnpm build`) |
| `pnpm lint` | ESLint |

---

## Project architecture

### Bootstrapping and global providers

`main.tsx` mounts `Provider`, which wraps the tree in this order:

1. **TanStack Query** — server state, caching, and request deduplication.
2. **AuthProvider** — current user in React context, persisted in `localStorage` under `user`.
3. **Router** — React Router browser router and route tree.
4. **Toaster** — global notifications (Sonner).

`App` is a thin shell that only renders an `<Outlet />` for nested routes.

### Routing

Routes live in `src/app/router.tsx`:

- **`/`** — marketing/landing page.
- **`/login` and `/register`** — wrapped in `PublicOnlyRoute` so authenticated users are redirected away.
- **`/dashboard/*`** — wrapped in `ProtectedRoute`, which checks for a `jwt` cookie and redirects to `/login` if missing.

The dashboard layout (`src/app/pages/dashboard/index.tsx`) provides the sidebar and a scrollable main area; child routes render in that outlet (`home`, `profile`, `charts`). The sidebar links to those sections, exposes an avatar menu (profile shortcut + logout), and includes the theme toggle. Logout clears the `jwt` cookie and drops the user from `AuthProvider` before navigating to `/login`.

### Layered `src/` layout

| Area | Role |
|------|------|
| `app/` | Shell: `provider`, `router`, `app`, and **pages** (route-level screens under `pages/`). |
| `features/` | **Vertical slices** by domain: `auth`, `transactions`, `transaction-groups`, `categories`, `user`. Each slice typically has `api/` (TanStack Query hooks), `components/`, and `types/`. |
| `lib/` | Cross-cutting infrastructure: `api-client` (base URL, JWT from cookie, JSON/blob handling), `auth-provider`, and **`auth.ts`** (`isAuthenticated()` helper based on the `jwt` cookie). |
| `components/` | Shared UI: `ui/` (design-system primitives), `common/` (sidebar, theme), `layout/` (stack/group/screen), `auth/` (route guards). |
| `types/` | Shared domain types used across features (e.g. `transaction`, `user`). |
| `utils/` | Small helpers (e.g. enum mapping). |

Path alias **`@/`** maps to `src/` (see `vite.config.ts`).

### Data and API access

- **`apiClient`** (`src/lib/api-client.ts`) is the single HTTP entry point. It builds URLs from `VITE_API_URL` (default `http://localhost:5000/api`) and `VITE_API_VERSION` (default `v1`), appends query params, sends JSON bodies, and attaches `Authorization: Bearer <jwt>` when the `jwt` cookie is present.
- **Reads** use **`useQuery`** with stable **`queryKey`s** (e.g. transactions, categories, groups, chart endpoints). Some queries use **`select`** to map API payloads into view models (for example enriching transactions with category and group objects from parallel lookups).
- **Writes and side effects** use **`useMutation`**: login/register, create/update/delete transactions, create transaction groups, CSV export (`blob` via `apiClient`), and **`PUT /users/profile`** for profile updates. Mutations that change shared lists often **`invalidateQueries`** (or otherwise refresh the cache) via `useQueryClient`. The profile mutation updates **`localStorage`** and **`AuthProvider`** on success so the header and profile page stay in sync with the server.

### UI composition

Pages compose **feature components** and shared **layout** primitives. Charts, tables, and filters live under `features/transactions`; the profile screen composes **`features/user`** (`ProfileForm` with Zod + React Hook Form). Styling is Tailwind-first; `components/ui` holds the shadcn-style building blocks (including newer pieces such as combobox, pagination, and slider where screens need them).

---

## Auth vulnerabilities

The JWT required to send requests to the API is stored in a plain cookie on the frontend after login.
The user object is stored in local storage.
This exposes the frontend to certain attacks, such as:

- **XSS (Cross-Site Scripting):** If an attacker manages to inject malicious JavaScript code into the application,
  they can steal the JWT and pretend to be the user whose JWT they stole.
- **CSRF (Cross-Site Request Forgery):** If another malicious website calls the Expense Tracker API,
  the cookie will be automatically sent. This means other sites can access the API on behalf of the user.
- **Man-in-the-Middle (MitM) attacks:** The current setup of Expense Tracker does not use HTTPS.

**Mitigations:**

- **XSS:** Make the cookie `HttpOnly`, which prevents JavaScript (including malicious scripts) from reading it.
- **CSRF:** Set `SameSite=Strict` (or appropriate SameSite policy) on the cookie so it is not sent on cross-site requests.
- **MitM:** Use HTTPS end-to-end (e.g. reverse proxy with TLS such as Nginx or Traefik with Let's Encrypt).

These measures improve security but do not guarantee perfect security.
For production auth, I prefer a maintained solution (e.g. Clerk, or a session-based stack like BetterAuth) rather than fully custom JWT-in-cookie patterns without hardening.
