import { Router } from 'express';
import {
  getAvailableSessions,
  getMyRegistrations,
  registerForSession,
  getLeadByTrackingId,
  cancelRegistration,
} from '../controllers/studentSession.controller.js';
import { authenticateStudentJwt, optionalStudentJwt } from '../middleware/studentAuth.js';

const router = Router();

router.get('/', optionalStudentJwt, getAvailableSessions);
router.get('/my-registrations', authenticateStudentJwt, getMyRegistrations);
router.get('/lead-by-tracking/:trackingId', getLeadByTrackingId);
router.post('/:id/register', optionalStudentJwt, registerForSession);
router.delete('/:id/cancel', authenticateStudentJwt, cancelRegistration);

export default router;
