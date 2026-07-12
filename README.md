# ITSC Human Resource Management System (HRMS)

A premium, full-stack Human Resource Management System built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern, glassmorphism-inspired dark theme UI, complete with an Admin Dashboard, Employee Dashboard, Attendance tracking, Leave Request management, and Payroll administration.

## Features

*   **Secure Authentication:** Role-based access control (Admin & Employee) using JWT.
*   **Modern Glassmorphic UI:** Premium dark theme with responsive sidebars, interactive data tables, and dynamic form layouts.
*   **Admin Dashboard:**
    *   **Employee Management:** Add, edit, view, and manage employees securely.
    *   **Department Management:** Group employees logically by creating and modifying organizational departments.
    *   **Leave Management:** Approve or reject leave requests submitted by employees.
    *   **Attendance Tracking:** Monitor daily employee check-ins/outs with summary statistics.
    *   **Payroll & Salary:** Add and track employee basic salaries, allowances, and deductions.
*   **Employee Dashboard:**
    *   **Self-Service Profile:** View and update personal information.
    *   **Leave Applications:** Submit leave requests directly to admins.
    *   **Salary History:** View personal salary and payroll history.
    *   **Attendance Logging:** Check in and out of the system directly from the dashboard.

## Tech Stack

*   **Frontend:** React, React Router v6, Tailwind CSS, Axios, React Data Table Component, Framer Motion
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Security:** bcryptjs, JSON Web Tokens (JWT)

## Project Structure

*   `/frontend` - React application (Vite)
*   `/server` - Express.js backend API

## Setup Instructions

### Prerequisites
*   Node.js (v16+)
*   MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & Install
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the `/server` directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/HRS
JWT_KEY=your_secure_jwt_secret_key
```

### 3. Seed Database (Optional)
To create an initial admin user (admin@gmail.com / admin123):
```bash
cd server
npm run seed
```

### 4. Run the Application
Start both the backend and frontend development servers.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## Demo Credentials
*   **Admin:** admin@gmail.com / admin123

## License
MIT License
