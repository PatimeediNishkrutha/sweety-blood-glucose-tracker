# Sweety – Blood Glucose Tracker

A full-stack blood glucose diary built with React, Node.js, Express, PostgreSQL and Prisma. Users can securely register, manage up to four daily glucose readings, and view daily, month-to-date and previous-month reports.

> This is a record-keeping demo application, not a medical device. It does not diagnose conditions or provide treatment advice.

## Technology

- Frontend: React 18, Vite, React Router, Axios, CSS, Recharts
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT and bcryptjs
- Tests: Node.js test runner and Vitest / React Testing Library

## Requirements

- Node.js 20 or newer (Node 22 LTS recommended)
- npm 10 or newer
- PostgreSQL 14 or newer

## 1. Create the database

Start PostgreSQL and create a database named `sweety_db`.

Using `psql`:

```sql
CREATE DATABASE sweety_db;
```

You can also create the database with pgAdmin.

## 2. Configure environment variables

Copy `backend/.env.example` to `backend/.env` and update the PostgreSQL username/password and JWT secret.

Example:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sweety_db?schema=public"
JWT_SECRET="use-a-long-random-secret-with-at-least-24-characters"
JWT_EXPIRES_IN="1d"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

Do not commit `.env` or real secrets. The root `.env.example` is a reference copy.

## 3. Install dependencies

From the project root:

```bash
npm install
```

## 4. Generate Prisma client and create tables

```bash
npm run db:generate
npm run db:migrate
```

Prisma will create the tables and the unique constraint that prevents a user from saving duplicate readings for the same date and time slot.

## 5. Seed demo data (optional)

```bash
npm run db:seed
```

Demo login:

- Email: `demo@sweety.app`
- Password: `SweetyDemo123!`

Change or remove this demo account before deploying publicly.

## 6. Run the application

From the root folder:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/api/health

You can also run each workspace separately:

```bash
npm run dev -w backend
npm run dev -w frontend
```

## 7. Run tests and build

```bash
npm test
npm run build -w frontend
```

Backend date-range tests use Node's built-in test runner. Frontend form tests use Vitest and React Testing Library.

## Features

### Authentication
- Register with name, email and password.
- Passwords are hashed with bcryptjs (never stored as plain text).
- JWT-protected routes.
- User identity comes from the verified token. Reading queries are always scoped to the authenticated user.

### Readings
- Create, list, update and delete readings.
- Four allowed slots: Morning (fasting), After breakfast, After lunch, After dinner.
- Value must be a whole number between 40 and 600 mg/dl.
- One reading per slot per date per user.
- Maximum four readings per date per user.
- Future dates are rejected.
- Paginated `GET /api/readings?page=1&limit=20` is included.

### Reports
- Daily: selected date.
- Month-to-date: first day of selected month through selected date.
- Monthly: complete previous calendar month.
- Highest, lowest, average (one decimal) and reading count.
- Daily report includes each reading and its slot.
- Empty report response is supported.

## API endpoints

All reading and report endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/readings` | List user's readings |
| POST | `/api/readings` | Add a reading |
| PUT | `/api/readings/:id` | Update a reading |
| DELETE | `/api/readings/:id` | Delete a reading |
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily report |
| GET | `/api/reports/month-to-date?date=YYYY-MM-DD` | Month-to-date report |
| GET | `/api/reports/monthly?date=YYYY-MM-DD` | Previous-month report |

Example reading body:

```json
{
  "date": "2026-11-10",
  "timeSlot": "Morning (fasting)",
  "value": 110
}
```

## Notes and assumptions

- Dates are stored as PostgreSQL `DATE` values and parsed as calendar dates to avoid time-of-day shifts.
- The selected date controls all report periods. The monthly report always means the complete previous calendar month relative to the selected date.
- JWT tokens are stored in browser local storage for this assignment. For a production system, consider secure, HTTP-only cookies, refresh-token rotation, rate limiting, stronger audit logging and a stricter deployment CORS policy.
- The UI displays glucose numbers as records only. It intentionally does not label values as medically safe/unsafe.
- Pagination is included as an optional enhancement. The dashboard and chart request a bounded list of recent readings for this assignment.
- The backend is authoritative for validation; frontend validation is provided for a quicker user experience.
- More time could be used for integration tests against a disposable PostgreSQL database, stronger accessibility review, date/time-zone configuration, Docker Compose and clinician-approved patient sharing.

## GitHub submission checklist

1. Create a public GitHub repository.
2. Commit the project in meaningful steps rather than one large commit.
3. Confirm `.env` is not tracked.
4. Run the migrations, seed script, tests and frontend build.
5. Capture screenshots or a 2–3 minute recording showing registration/login, adding/editing/deleting readings and all three report periods.
6. Include the repository URL and demo media in your submission email.
