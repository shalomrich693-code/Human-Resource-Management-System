import express from 'express';
import Salary from '../model/Salary.js';
import Employee from '../model/Employee.js';
import { verifyUser } from '../middleware/authMiddleware.js';
import { 
    addSalary, 
    getSalaryHistory,
    getEmployeeSalaryStats,
    getEmployeesByDepartment
} from '../controllers/salary.controller.js';

const router = express.Router();

// Employee routes
router.get('/employee/:id', verifyUser, async (req, res) => {
    try {
      const salaries = await Salary.find({ employee: req.params.id })
        .sort({ month: -1 })
        .populate('employee', 'name');
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get employee's salary statistics
router.get('/stats/employee', verifyUser, getEmployeeSalaryStats);

router.get('/employee/history', verifyUser, async (req, res) => {
  try {
    const salaries = await Salary.find({ employee: req.employee._id })
      .sort({ month: -1 })
      .populate('employee', 'name');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findById(req.body.employee);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const salary = new Salary({
      ...req.body,
      employee: employee._id,
      status: 'pending'
    });
    await salary.save();
    res.status(201).json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/admin/:employeeId', verifyUser, async (req, res) => {
  try {
    const salaries = await Salary.find({ employee: req.params.employeeId })
      .sort({ month: -1 })
      .populate('employee', 'name');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/:id', verifyUser, async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    salary.status = req.body.status;
    if (req.body.status === 'paid') {
      salary.paymentDate = new Date();
    }
    await salary.save();

    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/old', addSalary);
router.get('/employee/:employeeId/old', getSalaryHistory);
router.get('/department/:departmentId/employees/old', getEmployeesByDepartment);

export default router;