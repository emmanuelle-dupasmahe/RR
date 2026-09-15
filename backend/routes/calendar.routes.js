import express from 'express';
import * as calendarController from '../controllers/calendar.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/', authMiddleware, calendarController.getEvents);
router.post('/', authMiddleware, calendarController.createEvent);
router.put('/:id', authMiddleware, calendarController.updateEvent);
router.delete('/:id', authMiddleware, calendarController.deleteEvent);

export default router;