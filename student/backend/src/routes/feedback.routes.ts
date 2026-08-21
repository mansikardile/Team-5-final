import { Router } from 'express';
import {
  submitFeedback,
  getMyFeedbacks,
  getAllFeedbacks,
  submitFeedbackSchema,
} from '../controllers/feedback.controller.js';
import { authenticateStudentJwt } from '../middleware/studentAuth.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit 1-Minute Volunteer Feedback (Requires Login)
 *     tags: [VolunteerFeedback]
 *     security:
 *       - BearerAuth: []
 */
router.post(
  '/',
  authenticateStudentJwt,
  validateRequest(submitFeedbackSchema),
  submitFeedback
);

/**
 * @swagger
 * /api/feedback/me:
 *   get:
 *     summary: Get Logged In Volunteer Feedback History
 *     tags: [VolunteerFeedback]
 *     security:
 *       - BearerAuth: []
 */
router.get('/me', authenticateStudentJwt, getMyFeedbacks);

/**
 * @swagger
 * /api/feedback/all:
 *   get:
 *     summary: Get All Live Volunteer Feedbacks
 *     tags: [VolunteerFeedback]
 */
router.get('/all', getAllFeedbacks);

export default router;
