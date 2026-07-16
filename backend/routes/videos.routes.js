// routes/videos.routes.js
import express from 'express';
import {
    getAllVideos,
    createVideo,
    updateVideo,
    deleteVideo
} from '../controllers/videos.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Routes
router.get('/', getAllVideos);
router.post('/', authMiddleware, upload.single('video'), createVideo);
router.put('/:id', authMiddleware, updateVideo);
router.delete('/:id', authMiddleware, deleteVideo);

export default router;