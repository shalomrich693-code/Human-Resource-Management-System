import express from 'express';
import Leave from '../model/Leave.js';
import { verifyUser } from '../middleware/authMiddleware.js';
import { getEmployeeLeaveStats, getAllLeaves, updateLeaveStatus } from '../controllers/leave.controller.js';

const router = express.Router();

// Employee routes
router.get('/employee/stats', verifyUser, getEmployeeLeaveStats);

router.post('/employee/request', verifyUser, async (req, res) => {
  try {
    const leave = new Leave({
      employee: req.employee._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason || req.body.description, // Accept both field names
      status: 'pending'
    });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/employee/history', verifyUser, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.employee._id })
      .sort({ startDate: -1 })
      .populate('employee', 'name');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/all', verifyUser, getAllLeaves);

router.get('/admin/history/:employeeId', verifyUser, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .sort({ startDate: -1 })
      .populate('employee', 'name');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/:id', verifyUser, updateLeaveStatus);

export default router;
