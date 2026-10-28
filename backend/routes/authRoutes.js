import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;

