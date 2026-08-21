import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventByCode,
  deleteEvent,
  createEventSchema,
} from '../controllers/event.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

// Public endpoint to view event details by unique code for student registration
router.get('/code/:code', getEventByCode);

// Admin-protected endpoints
router.get('/', authenticateJwt, getEvents);
router.post('/', authenticateJwt, validateRequest(createEventSchema), createEvent);
router.delete('/:id', authenticateJwt, deleteEvent);

export default router;
