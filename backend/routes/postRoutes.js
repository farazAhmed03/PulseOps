import express from 'express';
import {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getAdminStats,
} from '../controllers/postController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin stats
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);

// My Posts (Must be before /:id to prevent route shadowing)
router.get('/my-posts', protect, getMyPosts);

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes (Login required)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
