import express from 'express';
import { verifyUser } from '../middleware/authMiddleware.js';
import {
    checkIn,
    checkOut,
    getTodayAttendance,
    getMyAttendanceHistory,
    getAttendanceByDate,
    getAttendanceSummary
} from '../controllers/attendance.controller.js';

const router = express.Router();

// Employee routes
router.post('/check-in', verifyUser, checkIn);
router.post('/check-out', verifyUser, checkOut);
router.get('/today', verifyUser, getTodayAttendance);
router.get('/my-history', verifyUser, getMyAttendanceHistory);

// Admin routes
router.get('/admin/by-date', verifyUser, getAttendanceByDate);
router.get('/admin/summary', verifyUser, getAttendanceSummary);

export default router;
