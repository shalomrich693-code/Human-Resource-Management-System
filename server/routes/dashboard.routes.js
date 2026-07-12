import express from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', verifyUser, getDashboardSummary);

export default router;
