# Product Management System API (Backend)

Submitted and created by John Patrick Ryan Mandal.

REST API built with Node.js + Express for managing products and users. Follows an MVC structure and uses PostgreSQL with Prisma ORM.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: JWT and cookie

## Prerequisites

- Node.js (v18+)
- A running PostgreSQL database instance (or a hosted DB URL)
- Docker + Docker Compose (optional, for one-command local setup)

## Installation

1. Clone the repository and enter the folder:

   ```bash
   git clone https://github.com/beefysalad/SMA-backend-assessment.git
   cd SMA-backend-assessment
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables.
   Create a `.env` file in the root of the `/backend` directory based on the `.env.example` structure (see table below).

## Environment Variables

| Variable        | Description                                                      |
| :-------------- | :--------------------------------------------------------------- |
| `DATABASE_URL`  | The full connection string to your PostgreSQL database.          |
| `PORT`          | The port the Express server runs on (default 8080).              |
| `JWT_SECRET`    | Secret key used to sign JWT tokens.                              |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS (e.g., `http://localhost:3000`). |

## Database Setup

Initialize the database schema using Prisma.

Important: migrations require a reachable Postgres database. If you are using Docker, start Docker and run `docker compose up --build` first (the container will run migrations automatically). If you are not using Docker, make sure your local/hosted Postgres is running and `DATABASE_URL` points to it.

```bash
npm run migrate
```

_(This command applies migrations found in `prisma/migrations` and ensures your database structure is up-to-date)._

Generate Prisma client:

```bash
npm run generate
```

## Seeder

Generate large test data (50,000 products):
using faker.js (https://fakerjs.dev/)

**If using Docker (Recommended):**
Run this command to execute the seeder inside the running API container:

```bash
npm run docker:seed
```

**If running locally (without Docker):**
Ensure you have generated the Prisma client first (`npm run generate`), then run:

```bash
npm run seed
```

## How to Run

### Option A: Docker (Recommended)

```bash
docker compose up --build
```

This starts:

- API on `http://localhost:8080`
- Postgres on `localhost:5433`

The Docker entrypoint runs Prisma migrations on startup, so you do not need to run `npm run migrate` separately when using Docker.

**DATABASE_URL note (host vs container):**
If you run the API on your host machine (e.g., `npm run dev`), use the host-exposed port:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sma_backend_db?schema=public"
```

If you run the API inside Docker (via `docker compose up`), use the Docker service name and container port:

```bash
DATABASE_URL="postgresql://postgres:postgres@db:5433/sma_backend_db?schema=public"
```

If port `8080` is busy, change the host port in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080"
```

Then access the API at `http://localhost:8081`.

**Development Mode:**
Runs the server with Nodemon to auto-restart on file changes.

```bash
npm run dev
```

## Where to find the DB

The Docker setup creates a Postgres database with:

- **Host**: `localhost`
- **Port**: `5433`
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `sma_backend_db`

You can connect using any Postgres GUI (TablePlus, DBeaver, pgAdmin) or CLI:

```bash
psql "postgresql://postgres:postgres@localhost:5433/sma_backend_db"
```

## API Endpoints

| Method   | Path                 | Auth Required | Description                             |
| :------- | :------------------- | :------------ | :-------------------------------------- |
| `POST`   | `/api/auth/sign-up`  | No            | Register a new user.                    |
| `POST`   | `/api/auth/sign-in`  | No            | Login and set httpOnly JWT cookie.      |
| `POST`   | `/api/auth/logout`   | No            | Clear auth cookie.                      |
| `PUT`    | `/api/auth/profile`  | Yes           | Update profile (name/password).         |
| `GET`    | `/api/products`      | Yes           | List products (pagination/search/sort). |
| `GET`    | `/api/products/:id`  | Yes           | Get product details.                    |
| `POST`   | `/api/products`      | Yes           | Create product.                         |
| `POST`   | `/api/products/seed` | Yes           | Seed dummy products.                    |
| `PUT`    | `/api/products/:id`  | Yes           | Update product.                         |
| `DELETE` | `/api/products/:id`  | Yes           | Delete product.                         |

### Query Params (Products)

- `page` (number) – page index (default 1)
- `limit` (number) – page size (default 20)
- `search` (string) – matches name/description
- `sortBy` (createdAt | price | name)
- `sortOrder` (asc | desc)

## Auth Flow

- Client calls `POST /api/auth/sign-in`
- Server validates credentials, signs JWT, and sets it in an httpOnly cookie (`token`)
- Protected routes read the cookie in auth middleware
