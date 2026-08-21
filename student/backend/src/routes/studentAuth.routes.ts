import { Router } from 'express';
import {
  signupStudent,
  loginStudent,
  requestOtp,
  verifyOtp,
  signupSchema,
  loginSchema,
} from '../controllers/studentAuth.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateStudentJwt } from '../middleware/studentAuth.js';

const router = Router();

router.post('/signup', validateRequest(signupSchema), signupStudent);
router.post('/login', validateRequest(loginSchema), loginStudent);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

export default router;
