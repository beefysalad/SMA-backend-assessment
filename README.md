# Product Management System API (Backend)

This is a RESTful API built with Node.js and Express for managing products and users. It follows an MVC-inspired architecture and uses PostgreSQL with Prisma ORM.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: bcrypt (JWT to be added)

## Prerequisites

- Node.js (v18+ recommended)
- A running PostgreSQL database instance (or a hosted DB URL)
- Docker + Docker Compose (optional, for one-command local setup)

## Installation

1. Clone the repository and navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables.
   Create a `.env` file in the root of the `/backend` directory based on the `.env.example` structure (see table below).

## Environment Variables

| Variable       | Description                                                                              |
| :------------- | :--------------------------------------------------------------------------------------- |
| `DATABASE_URL` | The full connection string to your PostgreSQL database.                                  |
| `PORT`         | The port the Express server runs on (defaults to 3000 if set in .env, fallback to 8080). |
| `JWT_SECRET`   | (Upcoming) Secret key used to sign JWT tokens.                                           |

## Database Setup

Initialize the database schema using Prisma:

```bash
npx prisma migrate dev
```

_(This command applies migrations found in `prisma/migrations` and ensures your database structure is up-to-date)._

## How to Run

### Option A: Docker (Recommended)

From the `backend` directory:

```bash
docker compose up --build
```

This starts:

- API on `http://localhost:8080`
- Postgres on `localhost:5433`

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

## API Endpoints (Current Implementation)

| Method | Path                | Auth Required | Description                                                         |
| :----- | :------------------ | :------------ | :------------------------------------------------------------------ |
| `POST` | `/api/auth/sign-up` | No            | Register a new user account.                                        |
| `POST` | `/api/auth/sign-in` | No            | Login with an existing user account. _(JWT auth flow in progress)._ |
