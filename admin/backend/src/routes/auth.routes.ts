import { Router } from 'express';
import { loginAdmin, getAdminProfile, loginSchema } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginAdmin);
router.get('/me', authenticateJwt, getAdminProfile);

export default router;
