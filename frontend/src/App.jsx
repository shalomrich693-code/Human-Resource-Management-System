import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { AuthProvider } from './context/authContext.jsx';
import RoleBasedRoutes from './utils/RoleBasedRoutes';
import PrivateRoutes from './utils/PrivateRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/dashboard/department/DepartmentList';
import AddDepartment from './components/dashboard/department/AddDepartment';
import EditDepartment from './components/dashboard/department/EditDepartment';
import ViewEmployee from './components/dashboard/employee/ViewEmployee';
import EmployeeList from './components/dashboard/employee/EmployeeList';
import AddEmployee from './components/dashboard/employee/AddEmployee';
import EditEmployee from './components/dashboard/employee/EditEmployee';
import AddSalary from './components/dashboard/salary/AddSalary';
import ViewSalary from './components/dashboard/salary/ViewSalary';
import AdminLeaveList from './components/dashboard/leave/AdminLeaveList';
import AdminAttendance from './components/dashboard/attendance/AdminAttendance';
import Dashboard from './components/dashboard/employee-dashboard/Dashboard';
import Leave from './components/dashboard/employee-dashboard/Leave';
import Salary from './components/dashboard/employee-dashboard/Salary';
import Profile from './components/dashboard/employee-dashboard/Profile';
import Settings from './components/dashboard/employee-dashboard/Settings';
import EmployeeAttendance from './components/dashboard/employee-dashboard/Attendance';
import './components/dashboard/employee-dashboard/Dashboard.css';
import './components/dashboard/employee-dashboard/Leave.css';
import './components/dashboard/employee-dashboard/Salary.css';
import './components/dashboard/employee-dashboard/Profile.css';
import './components/dashboard/employee-dashboard/Settings.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin-dashboard" element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }>
            {/* Dashboard Summary */}
            <Route index element={<AdminSummary />} />
            
            {/* Salary Routes */}
            <Route path="salary" element={<AddSalary />} />
            <Route path="salary/:id" element={<ViewSalary />} />
            
            {/* Employee Routes */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />
            <Route path="employees/view/:id" element={<ViewEmployee />} />
            
            {/* Department Routes */}
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="departments/edit/:id" element={<EditDepartment />} />
            
            {/* Management Routes */}
            <Route path="leaves" element={<AdminLeaveList />} />
            <Route path="attendance" element={<AdminAttendance />} />
          </Route>

          {/* Employee Dashboard Routes */}
          <Route path="/employee-dashboard/*" element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }>
            <Route index element={<Dashboard />} />
            <Route path="leave" element={<Leave />} />
            <Route path="salary" element={<Salary />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;