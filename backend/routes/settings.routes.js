// routes/settings.routes.js
import express from 'express';
import {
    getSetting,
    updateSetting
} from '../controllers/settings.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes
router.get('/:key', getSetting);
router.post('/:key', authMiddleware, updateSetting);

export default router;