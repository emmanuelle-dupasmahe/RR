// routes/groupesettings.routes.js
import express from 'express';
import {
    getAllSettings,
    updateSetting,
    uploadHeroImage
} from '../controllers/groupsettings.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Routes
router.get('/', getAllSettings);
router.post('/', authMiddleware, updateSetting);
router.post('/hero/:key', authMiddleware, upload.single('image'), uploadHeroImage);

export default router;