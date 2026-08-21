import { Router } from 'express';
import {
  getLeads,
  createLead,
  updateLeadStatus,
  exportLeadsCsv,
  triggerPersonalizedLink,
  sendCandidateEmail,
  createLeadSchema,
  updateLeadStatusSchema,
} from '../controllers/lead.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

// Public endpoint for student registration submission
router.post('/register', validateRequest(createLeadSchema), createLead);

// Admin-protected endpoints
router.get('/', authenticateJwt, getLeads);
router.get('/export', authenticateJwt, exportLeadsCsv);
router.get('/export/csv', exportLeadsCsv);
router.patch('/:id/status', authenticateJwt, validateRequest(updateLeadStatusSchema), updateLeadStatus);
router.post('/:id/resend-link', authenticateJwt, triggerPersonalizedLink);
router.post('/:id/send-email', authenticateJwt, sendCandidateEmail);

export default router;
