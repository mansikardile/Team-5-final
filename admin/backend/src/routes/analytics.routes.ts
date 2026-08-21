import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/funnel', authenticateJwt, getDashboardAnalytics);

export default router;
