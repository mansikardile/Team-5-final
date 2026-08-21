import { Router } from 'express';
import {
  getMyApplication,
  saveOrSubmitApplication,
  submitOfflineOrPersonalizedApplication,
} from '../controllers/scholarship.controller.js';
import { authenticateStudentJwt } from '../middleware/studentAuth.js';

const router = Router();

router.get('/', authenticateStudentJwt, getMyApplication);
router.post('/', authenticateStudentJwt, saveOrSubmitApplication);
router.post('/submit-offline', submitOfflineOrPersonalizedApplication);

export default router;
