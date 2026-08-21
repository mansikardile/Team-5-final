import { Router } from 'express';
import { getAdminFeedbacks } from '../controllers/feedback.controller.js';

const router = Router();

router.get('/', getAdminFeedbacks);

export default router;
