import { Router } from 'express';
import {
  getMentors,
  getMyMentorshipRequests,
  createMentorshipRequest,
} from '../controllers/mentorship.controller.js';
import { authenticateStudentJwt } from '../middleware/studentAuth.js';

const router = Router();

router.get('/mentors', getMentors);
router.get('/my-requests', authenticateStudentJwt, getMyMentorshipRequests);
router.post('/request', authenticateStudentJwt, createMentorshipRequest);

export default router;
