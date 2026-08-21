import { Router } from 'express';
import {
  getPendingVolunteers,
  verifyVolunteer,
  getEventAiSummary,
  dispatchEventQrEmails,
} from '../controllers/spoc.controller.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/pending-volunteers', authenticateJwt, getPendingVolunteers);
router.post('/verify-volunteer', authenticateJwt, verifyVolunteer);
router.post('/dispatch-qr-emails', authenticateJwt, dispatchEventQrEmails);
router.get('/event-ai-summary/:code', getEventAiSummary);

export default router;
