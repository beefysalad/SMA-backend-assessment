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

**Development Mode:**
Runs the server with Nodemon to auto-restart on file changes.

```bash
npm run dev
```

## API Endpoints (Current Implementation)

| Method | Path                | Auth Required | Description                                                         |
| :----- | :------------------ | :------------ | :------------------------------------------------------------------ |
| `POST` | `/api/auth/sign-up` | No            | Register a new user account.                                        |
| `POST` | `/api/auth/sign-in` | No            | Login with an existing user account. _(JWT auth flow in progress)._ |
