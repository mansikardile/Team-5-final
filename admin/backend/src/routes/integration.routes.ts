import { Router } from 'express';
import { syncGoogleSheets } from '../controllers/integration.controller.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post('/google-sheets/sync', authenticateJwt, syncGoogleSheets);

export default router;
