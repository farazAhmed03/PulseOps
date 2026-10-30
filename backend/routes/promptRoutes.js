import express from 'express';
import {
  getPrompts,
  getMyPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  copyPrompt,
  toggleLikePrompt,
  getCategoriesStats,
} from '../controllers/promptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public metadata & exploration
router.get('/categories', getCategoriesStats);
router.get('/', getPrompts);

// User-specific prompts
router.get('/my-prompts', protect, getMyPrompts);

// Single prompt
router.get('/:id', getPromptById);

// Prompt interactions
router.post('/:id/copy', copyPrompt);
router.post('/:id/like', protect, toggleLikePrompt);

// CRUD
router.post('/', protect, createPrompt);
router.put('/:id', protect, updatePrompt);
router.delete('/:id', protect, deletePrompt);

export default router;
