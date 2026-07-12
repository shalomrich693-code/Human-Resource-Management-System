import express from 'express';
import { 
    getAllEmployees, 
    createEmployee, 
    getEmployee, 
    updateEmployee, 
    deleteEmployee,
    searchEmployees,
    getEmployeesByDepartment
} from '../controllers/employee.controller.js';
import Employee from '../model/Employee.js';
import { verifyUser } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Employee routes - specific routes first
router.get('/search', verifyUser, searchEmployees);
router.get('/department/:departmentId', verifyUser, getEmployeesByDepartment);
router.get('/', verifyUser, getAllEmployees);
router.post('/', verifyUser, createEmployee);

// Profile routes - must come before /:id
router.get('/profile', verifyUser, async (req, res) => {
  try {
    console.log('Fetching profile for employee:', req.employee._id);
    
    if (!req.employee || !req.employee._id) {
      console.error('No employee found in request');
      return res.status(400).json({ 
        success: false, 
        error: 'No employee information found in request' 
      });
    }

    const employee = await Employee.findById(req.employee._id)
      .populate('department')
      .populate('position');
    
    if (!employee) {
      console.error('Employee not found in database');
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    console.log('Found employee:', {
      id: employee._id,
      name: employee.name,
      department: employee.department?.name,
      position: employee.position?.name
    });
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error in /profile route:', {
      message: error.message,
      stack: error.stack,
      request: {
        employee: req.employee,
        headers: req.headers,
        method: req.method,
        url: req.originalUrl
      }
    });
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put('/profile', verifyUser, async (req, res) => {
  try {
    const updates = {
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    const employee = await Employee.findByIdAndUpdate(
      req.employee._id,
      updates,
      { new: true }
    );

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Password change route
router.put('/change-password', verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id);
    
    // Verify current password
    const isValid = await employee.comparePassword(req.body.currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    // Hash new password
    employee.password = await bcrypt.hash(req.body.newPassword, 10);
    await employee.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/:employeeId', verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId)
      .populate('department')
      .populate('position');
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/:employeeId', verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// These routes must come after all specific routes
router.get('/:id', verifyUser, getEmployee);
router.put('/:id', verifyUser, updateEmployee);
router.delete('/:id', verifyUser, deleteEmployee);

export default router;