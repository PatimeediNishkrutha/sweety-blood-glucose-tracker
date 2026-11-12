# Sweety – Blood Glucose Tracker

A full-stack blood glucose tracking application built using React, Node.js, Express, PostgreSQL and Prisma. Sweety allows users to securely register, log in, record up to four blood glucose readings per day, manage their readings, and view daily and monthly reports.

> **Note:** This is a record-keeping demo application, not a medical device. It does not diagnose medical conditions or provide treatment advice.

## Technology Stack

- **Frontend:** React 18, Vite, React Router, Axios, CSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT and bcryptjs
- **Testing:** Node.js test runner, Vitest and React Testing Library

## Prerequisites

Install the following before running the application:

- Node.js 20 or newer (Node.js 22 LTS recommended)
- npm 10 or newer
- PostgreSQL 14 or newer
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/PatimeediNishkrutha/sweety-blood-glucose-tracker.git
cd sweety-blood-glucose-tracker
```

## 2. Create the PostgreSQL Database

Start PostgreSQL and create a database named `sweety_db`.

Using pgAdmin, create a database called `sweety_db`.

Alternatively, using the PostgreSQL command line:

```sql
CREATE DATABASE sweety_db;
```

## 3. Configure Environment Variables

Copy the backend environment template:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item backend/.env.example backend/.env
```

Update `backend/.env` with your local PostgreSQL credentials and a secure JWT secret.

Example configuration:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sweety_db?schema=public"
JWT_SECRET="your-long-random-secret"
JWT_EXPIRES_IN="1d"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

**Important:** Never commit `.env` files, database passwords or real secrets to GitHub. The `.env.example` file contains example configuration only.

## 4. Install Dependencies

From the project root, install all dependencies:

```bash
npm install
```

## 5. Generate Prisma Client and Run Database Migrations

Generate the Prisma client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

Prisma creates the required database tables and constraints, including the unique constraint that prevents duplicate readings for the same user, date and time slot.

## 6. Seed Demo Data

Run the seed command to create a demo user and sample glucose readings:

```bash
npm run db:seed
```

The seed script creates or updates the demo account and inserts sample readings across multiple days. It can be safely run again without creating duplicate records for the same user, date and time slot.

**Demo login credentials:**

- Email: `demo@sweety.app`
- Password: `SweetyDemo123!`

For a public production deployment, disable or remove the demo account and use a secure password.

## 7. Run the Application

Start both frontend and backend from the project root:

```bash
npm run dev
```

Application URLs:

- **Frontend:** http://localhost:5173
- **Backend health check:** http://localhost:5000/api/health

To run the applications separately:

Backend:

```bash
npm run dev -w backend
```

Frontend:

```bash
npm run dev -w frontend
```

## 8. Run Tests and Build

Run all backend and frontend tests:

```bash
npm test
```

Build the frontend:

```bash
npm run build -w frontend
```

The project includes:

- Backend unit tests using Node.js's built-in test runner.
- Frontend form validation tests using Vitest and React Testing Library.
- GitHub Actions CI workflow that automatically runs tests on pushes and pull requests targeting the `main` branch.

## Application Features

### 1. User Authentication

- User registration with name, email and password.
- Secure password hashing using bcryptjs.
- User login using JWT authentication.
- Protected API routes.
- Users can access only their own glucose readings.

### 2. Blood Glucose Reading Management

Users can add, view, edit and delete glucose readings.

The application supports four daily time slots:

1. Morning (fasting)
2. After breakfast
3. After lunch
4. After dinner

**Validation rules:**

- Glucose value is required.
- Value must be a whole number between 40 and 600 mg/dl.
- Only one reading is allowed per time slot per day.
- A maximum of four readings is allowed per day.
- Future dates are not allowed.
- Clear validation error messages are displayed when a rule is violated.

### 3. Reports and Calculations

The application provides three types of reports:

| Report | Description |
|---|---|
| Daily Report | Readings for the selected date |
| Month-to-Date Report | First day of the selected month through the selected date |
| Monthly Report | Complete previous calendar month |

Each report displays:

- Highest glucose reading
- Lowest glucose reading
- Average glucose reading, rounded to one decimal place
- Total number of readings

The daily report also displays individual readings and their corresponding time slots.

A friendly empty state is displayed when no readings are available.

### 4. Additional Features

- Pagination support for reading retrieval.
- Dashboard with recent glucose readings.
- Monthly glucose trend chart.
- Responsive user interface.
- Backend and frontend validation.

## API Endpoints

All reading and report endpoints require a valid JWT access token in the Authorization header.

Format:

```text
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user details |
| GET | `/api/readings` | Retrieve user's readings |
| POST | `/api/readings` | Add a glucose reading |
| PUT | `/api/readings/:id` | Update a reading |
| DELETE | `/api/readings/:id` | Delete a reading |
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Get daily report |
| GET | `/api/reports/month-to-date?date=YYYY-MM-DD` | Get month-to-date report |
| GET | `/api/reports/monthly?date=YYYY-MM-DD` | Get previous-month report |

### Example Reading Request

```json
{
  "date": "2026-11-10",
  "timeSlot": "Morning (fasting)",
  "value": 110
}
```

## Notes and Assumptions

- Dates are stored as PostgreSQL `DATE` values and handled as calendar dates to avoid time-of-day shifts.
- The selected date determines the reporting periods. The monthly report always represents the complete previous calendar month relative to the selected date.
- JWT tokens are stored in browser local storage for this assignment. A production application could use secure HTTP-only cookies, refresh-token rotation and additional security controls.
- The application records glucose readings but does not provide medical diagnosis or treatment recommendations.
- Pagination is implemented as an additional enhancement.
- Backend validation is authoritative, while frontend validation provides immediate feedback to users.
- With more development time, I would add integration tests against a separate PostgreSQL test database, improve accessibility, introduce Docker Compose, strengthen audit logging and explore clinician-approved patient sharing.

## GitHub Repository

Repository: https://github.com/PatimeediNishkrutha/sweety-blood-glucose-tracker

The project is maintained with meaningful Git commits and includes a GitHub Actions workflow for automated testing.

## Submission Checklist

- [x] Public GitHub repository.
- [x] React frontend and Node.js/Express backend.
- [x] PostgreSQL database integration.
- [x] User authentication and password hashing.
- [x] Reading management and validation.
- [x] Daily and monthly reports.
- [x] README installation and setup instructions.
- [x] `.env.example` without real secrets.
- [x] Database seed script with demo user and sample readings.
- [x] Backend and frontend tests.
- [x] GitHub Actions CI workflow.

**Remaining submission evidence:**

- [ ] Capture screenshots or record a 2–3 minute application demonstration.
- [ ] Verify the deployed application, if submitting a live application URL.
- [ ] Include the GitHub repository link and demo evidence in the reply email to Kenpath.