# Human Resource Management System (HRMS)

## Overview

A full-stack HR management application with separate admin and employee dashboards. It organizes employee records and supports department, attendance, leave, and salary workflows.

## Features

- Admin and employee dashboards
- Employee profile and department management
- Attendance check-in and check-out
- Employee leave requests and admin review
- Salary records and employee salary history
- JWT-based authentication with role-based access

## Technology Stack

- **Frontend:** React 19, React Router 7, Tailwind CSS, Axios
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## Architecture

The repository separates the Vite/React frontend in `frontend/` from the Express API in `server/`. The server exposes REST endpoints and persists employee, department, attendance, leave, salary, and user data through Mongoose models.

## Authentication and Roles

The application uses JWT-based authentication and distinguishes admin and employee dashboard workflows. Keep local environment secrets private. Demo access is available upon request.

## Project Structure

- `frontend/` — React application and dashboard interfaces
- `server/` — Express API, routes, controllers, middleware, and MongoDB models
- Root `package.json` — project-level scripts and configuration

## Local Setup

Requirements: Node.js 16 or later and MongoDB (local or Atlas).

Install dependencies in each application directory:

```bash
cd server
npm install
cd ../frontend
npm install
```

Create a local `server/.env` with the environment variables required by the server, including its port, MongoDB connection string, and JWT signing key. Do not commit real credentials.

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The Vite development server is configured to serve the frontend at `http://localhost:5173`.

## Engineering Highlights

- Full-stack separation between React client and Express API
- MongoDB data models and REST-style workflows
- Role-based dashboard access
- CRUD workflows for employee and department records
- Attendance, leave, and salary data flows

## Developer

**Shalom Solomon**  
Full Stack Developer | Mobile App Developer

[Portfolio](https://portfolio-zeta-teal-99.vercel.app) · [GitHub](https://github.com/shalomrich693-code)
