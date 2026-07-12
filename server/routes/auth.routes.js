import express from 'express';
import { login, verify } from '../controllers/authController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Login route
router.post('/login', login);
router.get('/verify', verifyUser, verify); // Updated to use authMiddleware

export default router;