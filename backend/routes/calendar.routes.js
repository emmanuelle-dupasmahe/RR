import express from 'express';
import * as calendarController from '../controllers/calendar.controller.js';
// L'import par défaut ne prend pas d'accolades { }
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// On place le pare-feu "authMiddleware" avant le contrôleur
router.get('/', authMiddleware, calendarController.getEvents);
router.post('/', authMiddleware, calendarController.createEvent);
router.put('/:id', authMiddleware, calendarController.updateEvent);
router.delete('/:id', authMiddleware, calendarController.deleteEvent);

export default router;