# Vacation Request Management

Small full-stack app for creating and reviewing vacation requests.

The app has two flows:

- **Requester** (`/request`) – create and view vacation requests
- **Validator** (`/`) – review requests, approve or reject them, filter by status, and view vacation stats

---

# Tech stack

| Area     | Stack                             |
| -------- | --------------------------------- |
| Frontend | Vue 3, TypeScript, PrimeVue, Vite |
| Backend  | Node.js, Express, TypeORM         |
| Database | PostgreSQL with Docker            |
| Testing  | Vitest, Supertest                 |

---

# Project structure

```txt
client/   Vue frontend application
server/   Express API and database logic
```

Frontend components are separated into requester and validator areas. Shared UI components are placed under the main `components` folder.

---

# Prerequisites

- Node.js 20+
- pnpm
- Docker

---

# Running locally

## 1. Copy environment files

`.env` files are gitignored, so create them locally from the example files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
cp server/.env.test.example server/.env.test
```

## 2. Install dependencies

```bash
pnpm install
```

## 3. Start PostgreSQL

```bash
pnpm db:up
```

## 4. Run database migrations

```bash
pnpm --filter ./server db:migrate
```

## 5. Start the project

Recommended way, from the root folder:

```bash
pnpm dev
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:3000
```

---

# Running frontend and backend separately

Backend:

```bash
pnpm dev:server
```

Frontend:

```bash
pnpm --filter ./client dev
```

---

# Testing

The project includes backend integration tests using Vitest and Supertest.

The tests cover:

- creating vacation requests
- approving requests
- rejecting requests
- validation errors
- filtering by status
- missing request errors

Create the test database once:

```bash
docker exec travel-factory-postgres createdb -U postgres travel_factory_test
```

Run tests:

```bash
pnpm test:server
```

Or from the `server` folder:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

---

# Technical notes

The assignment required Vue, Node.js, PostgreSQL, and TypeORM.

A few implementation choices I made:

- PrimeVue was used for tables, dialogs, form controls, and general UI building.
- Axios is used through a small API client wrapper to keep API calls consistent.
- Backend integration tests were added to test the real routes and database flow together.

---

# Known limitations

- Authentication and permissions are simplified.
- The requester user id is taken from environment variables.
- The backend does not require login. Anyone can call approve or reject requests.
- Pagination and server-side sorting were not implemented. The API returns the full list.
- Vacation overlap is only a hint in the request form and the API does not check overlaps.
- Pending requests cannot be edited or cancelled from the UI.

---

# Future improvements

- Real authentication and user roles
- Route guards so only the right role can use each page
- Pagination and sorting
- Return requester names in API responses and show them in tables
- Email or in-app notifications
- Server-side vacation overlap validation and block duplicate dates on create
- Edit or delete a request while it is still pending
- Stricter status rules on the server (for example, only pending requests can be approved or rejected)
- Frontend tests for forms and main flows
