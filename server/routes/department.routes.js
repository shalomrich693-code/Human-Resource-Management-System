import express from 'express';
import { createDepartment, getDepartment, updateDepartment, deleteDepartment, getAllDepartments } from '../controllers/department.controller.js';
import { verifyUser } from '../middleware/authMiddleware.js'; // Updated import

const router = express.Router();

router.get('/', verifyUser, getAllDepartments);
router.post('/', verifyUser, createDepartment);
router.get('/:id', verifyUser, getDepartment);
router.put('/:id', verifyUser, updateDepartment);
router.delete('/:id', verifyUser, deleteDepartment);

export default router;